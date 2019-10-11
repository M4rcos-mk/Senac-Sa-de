import { DatabaseService, Database } from './../services/database.service';
import { Component, OnInit } from '@angular/core';
import { database } from 'firebase';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})
export class ConsultaPage implements OnInit {

  databases: Database[];

  constructor(private DatabaseService: DatabaseService) { }

  ngOnInit() {
    this.DatabaseService.getDatabase().subscribe(res => {this.databases= res;});
  }
  remove(databases){this.DatabaseService.removeDatabase(databases.id);
  }
}
