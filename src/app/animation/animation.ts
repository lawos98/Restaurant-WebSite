import {
  animation, trigger, animateChild, group,
  transition, animate, style, query, state, stagger
} from '@angular/animations';

export const slideUp =
  trigger('flyUpInOut', [
    state('in', style({
      transform: 'translateY(0)', opacity: 1
    })),
    transition('void => *', [
      style({ transform: 'translateY(-50px)', opacity: 0 }),
      group([
        animate('0.3s 0.1s ease', style({
          transform: 'translateY(0)',
        })),
        animate('0.3s ease', style({
          opacity: 1
        })),
      ])
    ]),
    transition('* => void', [
      group([
        animate('0.3s ease', style({
          transform: 'translateY(-50px)',
        })),
        animate('0.3s 0.2s ease', style({
          opacity: 0
        }))
      ])
    ])
  ])
;

// Routable animations
export const slideLeft =
  trigger('flyLeftInOut', [
    state('in', style({
      transform: 'translateX(0)', opacity: 1
    })),
    transition('void => *', [
      style({ transform: 'translateX(-50px)', opacity: 0 }),
      group([
        animate('0.3s 0.1s ease', style({
          transform: 'translateX(0)',
        })),
        animate('0.3s ease', style({
          opacity: 1
        })),
      ])
    ]),
    transition('* => void', [
      group([
        animate('0.3s ease', style({
          transform: 'translateX(50px)',
        })),
        animate('0.3s 0.2s ease', style({
          opacity: 0
        }))
      ])
    ])
  ])
;

export const fadeGrow =
  trigger('fadeGrow', [
    transition(":enter", [
  query(":self", [
  style({ opacity: 0 }),
  stagger(500, [
  animate(1000, style({ opacity: 1 }))
])
])
])
])

