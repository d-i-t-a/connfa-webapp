import {Component, OnInit, OnDestroy} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {EventService} from "../../services/event.service";
import {Event} from "../../models/event";
import * as moment from 'moment';

declare var jQuery:any;

@Component({
    selector: 'event-details',
    templateUrl: '../../views/events_partials/details.html',
})

export class SocialeventDetailComponent implements OnInit, OnDestroy {

    public event:Event;
    public parentRoute:string = '/socialevents';
    public title:string = 'Social Events';
    public canView:boolean = false;

    constructor(private _eventService: EventService, private _router: ActivatedRoute) {}

    ngOnInit():any {

        if (this._router.params) {
            this._router.params.subscribe(params => {
                var id = params['id'];
                if (id) {
                    this._getEvent(id).then((event:Event) => {
                        var activeDate = moment(event.from, this._eventService.parseDateFormat).format('ddd D');
                        this._eventService.setActiveDate(activeDate);
                    });

                    this._eventService.eventsChanged$.subscribe((data:Event[]) => {
                        this._getEvent(id);
                    });

                    jQuery('body').addClass('overflowHidden');
                } else {
                    jQuery('body').removeClass('overflowHidden');
                }
            })
        }
    }

    ngOnDestroy(): void {
        jQuery('body').removeClass('overflowHidden');
    }

    private _getEvent(id:number) {
        return this._eventService.getEvent(id, 'social').then((event:Event)=> {
            return new Promise((resolve, reject) => {
                this.event = event;
                resolve(event);
                if (event && this._eventService.isNonClickable(event.type)) {
                    this.canView = false;
                } else {
                    this.canView = true;
                }
            });
        });
    }

}
