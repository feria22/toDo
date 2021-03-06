import { Priority } from './priority';
import { Category } from "./category";

  export class Task {
    id:number;
    title:string;
    completed:boolean;
    priority?: Priority | any;
    category?: Category | any;
    date?: Date

    constructor(id: number, title: string, completed: boolean, priority?: Priority, category?: Category, date?: Date) {
      this.id = id;
      this.title = title;
      this.completed = completed;
      priority ? this.priority = priority : null
      category ? this.category = category: null
      date? this.date = date: null
    }
  }
