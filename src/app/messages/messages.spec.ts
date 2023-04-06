import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessagesComponent } from './messages.component';

describe('MessagesComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    declarations: [
      MessagesComponent
    ]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MessagesComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
