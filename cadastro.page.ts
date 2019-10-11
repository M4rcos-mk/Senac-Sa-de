import { database } from 'firebase';

import { Database, DatabaseService } from './../services/database.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController,LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {

  database: Database={
    task:'', 
    createdAd: new Date().getTime(),
     email: '',
    peso: 0 ,
    pressao: 0 ,
    glicose: 0 ,
    altura: 0 ,
    idade: 0,
    msg: '',
    imc: 0
  };

  databaseId = null;


  constructor(
    private route: ActivatedRoute,
    private nav: NavController,
    private databaseService: DatabaseService,
    private loadingController: LoadingController
  ){ }

  ngOnInit() {
    this.databaseId =this.route.snapshot.params['id'];
    if(this.databaseId) {
      this.loadDatabase();
    }
  }
 async loadDatabase(){
   const loading = await this.loadingController.create({
    message: 'Loading Database..'
  });
  await loading.present(); 

  this.databaseService.getDatabases(this.databaseId).subscribe(res=>{
    loading.dismiss();
    this.database = res;
  });
 }
 async saveDatabase(){
    const loading = await this.loadingController.create({
      message:'Saving Database..'
    });
    await loading.present(); 

    if(this.databaseId){ 
      this.databaseService.updateDatabase(this.database, this.databaseId).then(() =>{
       loading.dismiss();
       this.calcularImc();
       this.nav.back();

      });
    }else{
     this.database.imc= this.database.peso/(this.database.altura*this.database.altura);
     this.database.imc= parseFloat(this.database.imc.toFixed(2))   
      this.databaseService.addDatabase(this.database).then(()=>{
       loading.dismiss();
       console.log(this.database);
        this.nav.back();
      });
    }
   }
   calcularImc(){
    this.database.imc = this.database.peso/(this.database.altura*this.database.altura);
    this.database.imc = parseFloat(this.database.imc.toFixed(2))

    if(this.database.imc<18.5){
      this.database.msg= ("Magro: " + this.database.imc);
    }
    else if(this.database.imc>=18.5 && this.database.imc<24.9){
      this.database.msg= ("IMC Normal: " + this.database.imc);
    }

    else if(this.database.imc>=25 && this.database.imc<29.9) {
      this.database.msg= ("Sobre Peso:" + this.database.imc);
    }
    else if(this.database.imc>=30 && this.database.imc<39.9) {
      this.database.msg= ("Obesidade:" + this.database.imc);
    }
    else if (this.database.imc>40) {
      this.database.msg= ("Vá ao cardiologista: " + this.database.imc);
    }
    }
  }
