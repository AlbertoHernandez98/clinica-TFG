import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStateService } from 'src/app/providers/app-state/app-state.service';
import { AppInfo } from 'src/app/providers/app-state/models/app-state.interface';

@Component({
  selector: 'app-servicios-menu',
  templateUrl: './servicios-menu.component.html',
  styleUrls: ['./servicios-menu.component.scss']
})
export class ServiciosMenuComponent implements OnInit {

  quiroBool = true;
  bioBool = false;
  ungBool = false;
  oseaBool = false;
  pieBool = false;
  infBool = false;
  gerBool = false;
  domBool = false;

  constructor(
    private translate: TranslateService,
    private appService: AppStateService,
  ) { }

  ngOnInit() {
    this.getTranslate();
  }



  getTranslate() {
    this.appService
      .traduccionesLoaded('BREADCUMTEXT.SERVICIOS')
      .subscribe((res) => {
        this.initRoutes();
      });
  }

  initRoutes() {
    const appInfo: AppInfo = {
      breadcum: [
        {
          active: true,
          name: this.translate.instant('BREADCUMTEXT.MENU'),
          route: '/access-menu'
        },
        {
          active: false,
          name: this.translate.instant('BREADCUMTEXT.SERVICIOS'),
          route: '/serviciosMenu'
        },
      ],
      isLogged: true,
      idMenuActive: '1'
    };
    this.appService.setBreadcumInfo(appInfo, 'appInfo');
  }

  quiro() {
    this.quiroBool = true;
    this.bioBool = false;
    this.ungBool = false;
    this.oseaBool = false;
    this.pieBool = false;
    this.infBool = false;
    this.gerBool = false;
    this.domBool = false;


    var quiro = document.getElementById('quiro');
    var bio = document.getElementById('bio');
    var ung = document.getElementById('ung');
    var osea = document.getElementById('osea');
    var pie = document.getElementById('pie');
    var inf = document.getElementById('inf');
    var ger = document.getElementById('ger');
    var dom = document.getElementById('dom');


    if (bio !== null) {
      bio.style.color = '#a25f4b99';
    }
    if (ung !== null) {
      ung.style.color = '#a25f4b99';
    }
    if (osea !== null) {
      osea.style.color = '#a25f4b99';
    }
    if (pie !== null) {
      pie.style.color = '#a25f4b99';
    }
    if (inf !== null) {
      inf.style.color = '#a25f4b99';
    }
    if (ger !== null) {
      ger.style.color = '#a25f4b99';
    }
    if (dom !== null) {
      dom.style.color = '#a25f4b99';
    }


    if (quiro !== null) {
      quiro.style.color = '#A25F4B';
    }
  }

  bio() {
    this.quiroBool = false;
    this.bioBool = true;
    this.ungBool = false;
    this.oseaBool = false;
    this.pieBool = false;
    this.infBool = false;
    this.gerBool = false;
    this.domBool = false;

    var quiro = document.getElementById('quiro');
    var bio = document.getElementById('bio');
    var ung = document.getElementById('ung');
    var osea = document.getElementById('osea');
    var pie = document.getElementById('pie');
    var inf = document.getElementById('inf');
    var ger = document.getElementById('ger');
    var dom = document.getElementById('dom');

    
    if (quiro !== null) {
      quiro.style.color = '#a25f4b99';
    }
    if (ung !== null) {
      ung.style.color = '#a25f4b99';
    }
    if (osea !== null) {
      osea.style.color = '#a25f4b99';
    }
    if (pie !== null) {
      pie.style.color = '#a25f4b99';
    }
    if (inf !== null) {
      inf.style.color = '#a25f4b99';
    }
    if (ger !== null) {
      ger.style.color = '#a25f4b99';
    }
    if (dom !== null) {
      dom.style.color = '#a25f4b99';
    }




    if (bio !== null) {
      bio.style.color = '#A25F4B';
    }
  }

  ung() {
    this.quiroBool = false;
    this.bioBool = false;
    this.ungBool = true;
    this.oseaBool = false;
    this.pieBool = false;
    this.infBool = false;
    this.gerBool = false;
    this.domBool = false;
  }

  osea() {
    this.quiroBool = false;
    this.bioBool = false;
    this.ungBool = false;
    this.oseaBool = true;
    this.pieBool = false;
    this.infBool = false;
    this.gerBool = false;
    this.domBool = false;

    var quiro = document.getElementById('quiro');
    var bio = document.getElementById('bio');
    var ung = document.getElementById('ung');
    var osea = document.getElementById('osea');
    var pie = document.getElementById('pie');
    var inf = document.getElementById('inf');
    var ger = document.getElementById('ger');
    var dom = document.getElementById('dom');

    
    if (quiro !== null) {
      quiro.style.color = '#a25f4b99';
    }
    if (ung !== null) {
      ung.style.color = '#a25f4b99';
    }
    if (bio !== null) {
      bio.style.color = '#a25f4b99';
    }
    if (pie !== null) {
      pie.style.color = '#a25f4b99';
    }
    if (inf !== null) {
      inf.style.color = '#a25f4b99';
    }
    if (ger !== null) {
      ger.style.color = '#a25f4b99';
    }
    if (dom !== null) {
      dom.style.color = '#a25f4b99';
    }




    if (osea !== null) {
      osea.style.color = '#A25F4B';
    }
  }

  pie() {
    this.quiroBool = false;
    this.bioBool = false;
    this.ungBool = false;
    this.oseaBool = false;
    this.pieBool = true;
    this.infBool = false;
    this.gerBool = false;
    this.domBool = false;


    var quiro = document.getElementById('quiro');
    var bio = document.getElementById('bio');
    var ung = document.getElementById('ung');
    var osea = document.getElementById('osea');
    var pie = document.getElementById('pie');
    var inf = document.getElementById('inf');
    var ger = document.getElementById('ger');
    var dom = document.getElementById('dom');

    
    if (quiro !== null) {
      quiro.style.color = '#a25f4b99';
    }
    if (ung !== null) {
      ung.style.color = '#a25f4b99';
    }
    if (bio !== null) {
      bio.style.color = '#a25f4b99';
    }
    if (osea !== null) {
      osea.style.color = '#a25f4b99';
    }
    if (inf !== null) {
      inf.style.color = '#a25f4b99';
    }
    if (ger !== null) {
      ger.style.color = '#a25f4b99';
    }
    if (dom !== null) {
      dom.style.color = '#a25f4b99';
    }




    if (pie !== null) {
      pie.style.color = '#A25F4B';
    }
  }

  inf() {
    this.quiroBool = false;
    this.bioBool = false;
    this.ungBool = false;
    this.oseaBool = false;
    this.pieBool = false;
    this.infBool = true;
    this.gerBool = false;
    this.domBool = false;


    var quiro = document.getElementById('quiro');
    var bio = document.getElementById('bio');
    var ung = document.getElementById('ung');
    var osea = document.getElementById('osea');
    var pie = document.getElementById('pie');
    var inf = document.getElementById('inf');
    var ger = document.getElementById('ger');
    var dom = document.getElementById('dom');

    
    if (quiro !== null) {
      quiro.style.color = '#a25f4b99';
    }
    if (ung !== null) {
      ung.style.color = '#a25f4b99';
    }
    if (bio !== null) {
      bio.style.color = '#a25f4b99';
    }
    if (pie !== null) {
      pie.style.color = '#a25f4b99';
    }
    if (osea !== null) {
      osea.style.color = '#a25f4b99';
    }
    if (ger !== null) {
      ger.style.color = '#a25f4b99';
    }
    if (dom !== null) {
      dom.style.color = '#a25f4b99';
    }




    if (inf !== null) {
      inf.style.color = '#A25F4B';
    }
  }

  ger() {
    this.quiroBool = false;
    this.bioBool = false;
    this.ungBool = false;
    this.oseaBool = false;
    this.pieBool = false;
    this.infBool = false;
    this.gerBool = true;
    this.domBool = false;


    var quiro = document.getElementById('quiro');
    var bio = document.getElementById('bio');
    var ung = document.getElementById('ung');
    var osea = document.getElementById('osea');
    var pie = document.getElementById('pie');
    var inf = document.getElementById('inf');
    var ger = document.getElementById('ger');
    var dom = document.getElementById('dom');

    
    if (quiro !== null) {
      quiro.style.color = '#a25f4b99';
    }
    if (ung !== null) {
      ung.style.color = '#a25f4b99';
    }
    if (bio !== null) {
      bio.style.color = '#a25f4b99';
    }
    if (pie !== null) {
      pie.style.color = '#a25f4b99';
    }
    if (inf !== null) {
      inf.style.color = '#a25f4b99';
    }
    if (osea !== null) {
      osea.style.color = '#a25f4b99';
    }
    if (dom !== null) {
      dom.style.color = '#a25f4b99';
    }




    if (ger !== null) {
      ger.style.color = '#A25F4B';
    }
  }

  serv() {
    this.quiroBool = false;
    this.bioBool = false;
    this.ungBool = false;
    this.oseaBool = false;
    this.pieBool = false;
    this.infBool = false;
    this.gerBool = false;
    this.domBool = true;


    var quiro = document.getElementById('quiro');
    var bio = document.getElementById('bio');
    var ung = document.getElementById('ung');
    var osea = document.getElementById('osea');
    var pie = document.getElementById('pie');
    var inf = document.getElementById('inf');
    var ger = document.getElementById('ger');
    var dom = document.getElementById('dom');

    
    if (quiro !== null) {
      quiro.style.color = '#a25f4b99';
    }
    if (ung !== null) {
      ung.style.color = '#a25f4b99';
    }
    if (bio !== null) {
      bio.style.color = '#a25f4b99';
    }
    if (pie !== null) {
      pie.style.color = '#a25f4b99';
    }
    if (inf !== null) {
      inf.style.color = '#a25f4b99';
    }
    if (ger !== null) {
      ger.style.color = '#a25f4b99';
    }
    if (osea !== null) {
      osea.style.color = '#a25f4b99';
    }




    if (dom !== null) {
      dom.style.color = '#A25F4B';
    }
  }

}


