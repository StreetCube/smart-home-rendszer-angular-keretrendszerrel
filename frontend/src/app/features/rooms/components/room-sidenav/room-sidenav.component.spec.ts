import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomSidenavComponent } from './room-sidenav.component';

describe('RoomSidenavComponent', () => {
  let component: RoomSidenavComponent;
  let fixture: ComponentFixture<RoomSidenavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomSidenavComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomSidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
