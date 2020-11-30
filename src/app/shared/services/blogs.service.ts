import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBlog } from '../interfaces/blog.interface';

@Injectable({
  providedIn: 'root'
})
export class BlogsService {

  private blogs: Array<IBlog> = [];

  private url: string;
  constructor(private http: HttpClient) {
    this.url = 'http://localhost:3000/blogs';
  }

  getJSONBlogs(): Observable<Array<IBlog>> {
    return this.http.get<Array<IBlog>>(this.url);
  };

  postJSONBlog(blog: IBlog): Observable<IBlog> {
    return this.http.post<IBlog>(this.url, blog);
  };

  updateJSONBlog(blog: IBlog): Observable<IBlog> {
    return this.http.put<IBlog>(`${this.url}/${blog.id}`, blog);
  };

  deleteJSONBlog(blog: IBlog): Observable<IBlog> {
    return this.http.delete<IBlog>(`${this.url}/${blog.id}`);
  };

  getJSONOneBlog(id: number | string): Observable<IBlog> {
    return this.http.get<IBlog>(`${this.url}/${id}`);
  };
}
