import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {

  constructor() { }

  text: string;
  tags = [];

  setText(data: string) {
        this.text = data;
  }

  getText() {
    return this.text;
  }

  setTags(tags) {
      this.tags = tags;
  }

  getTags() {
    return this.tags;
  }


}
