import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ThumbnailService } from './thumbnail.service';
import { API_BASE } from '../../tokens';

describe('[Core] ThumbnailService', () => {
  let service: ThumbnailService;
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

    service = TestBed.inject(ThumbnailService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should return thumbnailUrl', () => {
    service.getThumbnail(1).subscribe((url) => expect(url).toEqual('testThumbnailUrl'));

    const req = httpTestingController.expectOne('http://testurl.com/photos/1');
    req.flush({ thumbnailUrl: 'testThumbnailUrl' });

    expect(req.request.method).toEqual('GET');
  });
});
