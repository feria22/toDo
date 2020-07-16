export class Category {
  id:number;
  title:string
  uncompleted?: number
  constructor(id:number,title:string) {
    this.id=id
    this.title=title
  }
}
