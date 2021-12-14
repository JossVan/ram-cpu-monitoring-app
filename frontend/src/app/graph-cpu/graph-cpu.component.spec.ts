import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphCPUComponent } from './graph-cpu.component';

describe('GraphCPUComponent', () => {
  let component: GraphCPUComponent;
  let fixture: ComponentFixture<GraphCPUComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphCPUComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphCPUComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
