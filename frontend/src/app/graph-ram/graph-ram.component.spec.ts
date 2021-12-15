import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphRAMComponent } from './graph-ram.component';

describe('GraphRAMComponent', () => {
  let component: GraphRAMComponent;
  let fixture: ComponentFixture<GraphRAMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphRAMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphRAMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
