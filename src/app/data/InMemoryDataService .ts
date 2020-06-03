import { InMemoryDbService } from 'angular-in-memory-web-api';
import {Observable} from "rxjs";

export class InMemHeroService implements InMemoryDbService {
  createDb() {
    let category=[
      {id: 1, title: 'Praca'},
      {id: 3, title: 'Studia'},
      {id: 2, title: 'Rodzina'},
      {id: 4, title: 'Urlop'},
      {id: 6, title: 'Jedzenie'},
      {id: 5, title: 'Sport'},
      {id: 7, title: 'Pieniądze'},
      {id: 8, title: 'Gadżety'},
      {id: 9, title: 'Zdrowie'},
      {id: 10, title: 'Samochód'},
      {id: 11, title: 'Naprawy'},
    ];
    let priorities = [
      {id: 1, title: 'Niski', color: '#a5b6c6'},
      {id: 2, title: 'Śriedni', color: '#1d9c10'},
      {id: 3, title: 'Wysoki', color: '#e32d40'},
      {id: 4, title: 'Bardzo pilne!!', color: '#66111e'}
    ];
    let tasks= [
      {
        id: 1,
        title: 'Zatankować samochód',
        priority: 2,
        completed: false,
        category: 9,
        date: new Date('2020-06-10')
      },

      {
        id: 2,
        title: 'Prześlać raporty do kierownika działu',
        priority: 0,
        completed: false,
        category: 0,
        date: new Date('2020-04-11')
      },

      {
        id: 3,
        title: 'Posprzątać w pokoju',
        priority: 2,
        completed: true,
        category: 1
      },

      {
        id: 4,
        title: 'Pójść na spacer do parku z rodziną',
        priority: 1,
        completed: false,
        category: 1,
        date: new Date('2020-08-17')
      },
      {
        id: 5,
        title: 'Naucz się Angulara',
        completed: false,
        category: 2
      },
      {
        id: 6,
        title: 'Pójść na meet-up z programowania',
        priority: 1,
        completed: true,
        category: 2,
        date: new Date('2020-06-11')
      },

      {
        id: 7,
        title: 'Znajdź bilety do Turcji, wybierz hotel',
        priority: 2,
        completed: false,
        category: 3
      },
      {
        id: 8,
        title: 'Zrób obiad dla całej rodziny',
        completed: false,
        category: 5
      },
      {
        id: 9,
        title: 'Podciągnij 10 razy',
        priority: 2,
        completed: false,
        category: 4,
        date: new Date('2020-06-12')
      },
      {
        id: 10,
        title: 'Przebiec 100 m',
        priority: 0,
        completed: true,
        category: 4
      },

      {
        id: 11,
        title: 'Zorganizować imprezę dla dzieci',
        completed: false
      },

      {
        id: 12,
        title: 'Pójść na wykładu „Jak nauczyć się programować na Java"',
        priority: 1,
        completed: false,
        category: 2
      },
      {
        id: 13,
        title: 'Zrobić zakupy',
        priority: 2,
        completed: false,
        category: 5,
        date: new Date('2020-06-11')
      },

      {
        id: 14,
        title: 'Zrobić spotkanie na temat wszystkich projektów',
        completed: true,
        category: 0
      },

      {
        id: 15,
        title: 'Zdać egzamin',
        priority: 2,
        completed: true
      },


      {
        id: 16,
        title: 'Sprawdzić pieniądze w banku',
        priority: 3,
        completed: false,
        category: 6
      },

      {
        id: 17,
        title: 'Poproś o podwyżkę w pracy',
        priority: 2,
        completed: false,
        category: 6
      },

      {
        id: 18,
        title: 'Zroobić badania',
        priority: 3,
        completed: false,
        category: 8,
        date: new Date('2020-12-11')

      },

      {
        id: 19,
        title: 'Przeczytać opinie o Mi band 5',
        priority: 0,
        completed: false,
        category: 7,
        date: new Date('2020-08-11')

      },

      {
        id: 20,
        title: 'Pilka nożna',
        priority: 0,
        completed: false,
        category: 4,
        date: new Date('2020-06-17')

      }

    ];
    return {priorities,category,tasks};
  }

}
