import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ProjectList } from './project-list';
import { AuthService } from '@core/auth/auth-service';
import { signal } from '@angular/core';
import { ProjectOfUserDTO } from '@core/api/types';
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';
import { provideRouter } from '@angular/router';

describe('ProjectList', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProjectList],

      providers: [
        //Permet de simuler que l'user est loggedIn
        { provide: AuthService, useValue: { userId: 1 } },
        provideTanStackQuery(new QueryClient()),
        provideRouter([]),
      ],
    });

  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ProjectList);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should display projects', () => {
    const fixture = TestBed.createComponent(ProjectList);
    const component = fixture.componentInstance;

    //Mock de tanstack-query
    const queryMock = {
      data: signal<ProjectOfUserDTO[]>([
        {
          id: 1,
          name: 'Projet Test 1',
          description: 'Description du projet 1',
          startDate: '2025-09-01',
          createdAt: '2025-09-01',
          membership: { role: 'ADMIN' },
        },
        {
          id: 2,
          name: 'Projet Test 2',
          description: 'Description du projet 2',
          startDate: '2025-09-01',
          createdAt: '2025-09-01',
          membership: { role: 'MEMBER' },
        },
      ]),
      status: signal('success'),
      error: signal(null),
      refetch: () => {},
    };

    //@ts-ignore
    component.projects = queryMock;

    fixture.detectChanges();

    const projectCards = fixture.nativeElement.querySelectorAll('.app-card-clickable');
    expect(projectCards).toHaveLength(2);

    // Verification des cartes
    expect(projectCards[0].textContent).toContain('Projet Test 1');
    expect(projectCards[0].textContent).toContain('Description du projet 1');

    // Vérifier le premier projet
    expect(projectCards[1].textContent).toContain('Projet Test 2');
    expect(projectCards[1].textContent).toContain('Description du projet 2');

    // Bouton de créations
    const createButton = fixture.nativeElement.querySelector('.app-card-draft');
    expect(createButton).toBeTruthy();
    expect(createButton.textContent).toContain('Créer un nouveau projet');
  });
});
