import { animate, animateChild, group, keyframes, query, style, transition, trigger } from "@angular/animations";

export const routeSlideAnimation =
  trigger('routeAnimations', [
    transition('actual => *', [
      style({position: 'relative'}),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
        }),
      ]),
      query(':enter', [style({left: '100%'})], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [animate('300ms ease-out', style({left: '-100%'}))], {optional: true}),
        query(':enter', [animate('300ms ease-out', style({left: '0%'}))], {optional: true}),
      ]),
    ]),
    transition('* => actual', [
      style({position: 'relative'}),
      query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
          }),
        ],
        {optional: true},
      ),
      query(':enter', [style({left: '-100%'})], {optional: true}),
      query(':leave', animateChild(), {optional: true}),
      group([
        query(':leave', [animate('200ms ease-out', style({left: '100%', opacity: 0}))], {optional: true}),
        query(':enter', [animate('300ms ease-out', style({left: '0%'}))], {optional: true}),
        query('@*', animateChild(), {optional: true}),
      ]),
    ]),
  ]);

  export const numberChangeAnimation = trigger(
    'changeNumberAnimation', [
        transition(':increment, :decrement', [
            query(':self', [animate('500ms ease-out', keyframes([
                style({ transform: 'scale3d(1, 1, 1)' }),
                style({ transform: 'scale3d(1, 0.8, 1)' }),
                style({ transform: 'scale3d(1, 1, 1)' }),          
            ]))])
        ]),
    ]
  );