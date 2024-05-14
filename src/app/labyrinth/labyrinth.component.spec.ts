import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabyrinthComponent } from './labyrinth.component';

describe('LabyrinthComponent', () => {
  let component: LabyrinthComponent;
  let fixture: ComponentFixture<LabyrinthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabyrinthComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LabyrinthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
