import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProjectPage } from './project-page';
import { signal } from '@angular/core';

describe('ProjectPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectPage]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProjectPage);
    const component = fixture.componentInstance;
    
    // Mock des queries pour éviter l'erreur QueryClient
    const queryMock = {
      data: signal(null),
      status: signal('success'),
      error: signal(null),
      refetch: () => {},
    };
    
    //@ts-ignore
    component.project = queryMock;
    //@ts-ignore
    component.projectMembers = queryMock;
    //@ts-ignore
    component.tasks = queryMock;
    
    expect(component).toBeTruthy();
  });
});
