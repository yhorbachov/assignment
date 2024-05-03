import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsersService } from './users.service';
import { API_BASE } from '../../tokens';

describe('[Core] UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: API_BASE,
          useValue: 'http://testurl.com',
        },
      ],
    });

    service = TestBed.inject(UsersService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should create user', () => {
    service
      .createUser({
        firstName: 'John',
        lastName: 'Doe',
        email: 'foo@test.com',
        thumbnailUrl: 'http://testurl.com/thumbnail.jpg',
      })
      .subscribe();

    const req = httpTestingController.expectOne('http://testurl.com/users');
    expect(req.request.method).toEqual('POST');
  });
});
