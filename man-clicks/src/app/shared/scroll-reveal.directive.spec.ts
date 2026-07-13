import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollRevealDirective } from './scroll-reveal.directive';

@Component({
  standalone: true,
  imports: [ScrollRevealDirective],
  template: `<div appScrollReveal>content</div>`,
})
class HostComponent {}

describe('ScrollRevealDirective', () => {
  let fixture: ComponentFixture<HostComponent>;
  let observeSpy: jasmine.Spy;
  let intersectionCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observeSpy = jasmine.createSpy('observe');
    (window as any).IntersectionObserver = class {
      constructor(cb: IntersectionObserverCallback) {
        intersectionCallback = cb;
      }
      observe = observeSpy;
      disconnect = jasmine.createSpy('disconnect');
    };

    TestBed.configureTestingModule({ imports: [HostComponent] });
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('does not have the is-visible class before intersecting', () => {
    const div: HTMLElement = fixture.nativeElement.querySelector('div');
    expect(div.classList.contains('is-visible')).toBeFalse();
  });

  it('adds the is-visible class once IntersectionObserver reports intersection', () => {
    const div: HTMLElement = fixture.nativeElement.querySelector('div');
    intersectionCallback(
      [{ isIntersecting: true, target: div } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
    expect(div.classList.contains('is-visible')).toBeTrue();
  });

  it('observes the host element on init', () => {
    expect(observeSpy).toHaveBeenCalled();
  });
});
