import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-select-municipality2',
  templateUrl: './select-municipality2.component.html',
  styleUrls: ['./select-municipality2.component.css']
})
export class SelectMunicipality2Component implements OnInit,OnChanges {

  // municipios:any[]=[
  //   { department: "AHUACHAPÁN", municipality: "AHUACHAPÁN"},
  //   { department: "AHUACHAPÁN", municipality: "APANECA"},
  //   { department: "AHUACHAPÁN", municipality: "ATIQUIZAYA"},
  //   { department: "AHUACHAPÁN", municipality: "CONCEPCIÓN DE ATACO"},
  //   { department: "AHUACHAPÁN", municipality: "EL REFUGIO" },
  //   { department: "AHUACHAPÁN", municipality: "GUAYMANGO" },
  //   { department: "AHUACHAPÁN", municipality: "JUJUTLA" },
  //   { department: "AHUACHAPÁN", municipality: "SAN FRANCISCO MENÉNDEZ" },
  //   { department: "AHUACHAPÁN", municipality: "SAN LORENZO" },
  //   { department: "AHUACHAPÁN", municipality: "SAN PEDRO PUXTLA" },
  //   { department: "AHUACHAPÁN", municipality: "TACUBA" },
  //   { department: "AHUACHAPÁN", municipality: "TURÍN" },
  //   { department: "CABAÑAS", municipality: "SENSUNTEPEQUE" },
  //   { department: "CABAÑAS", municipality: "CINQUERA" },
  //   { department: "CABAÑAS", municipality: "DOLORES" },
  //   { department: "CABAÑAS", municipality: "GUACOTECTI" },
  //   { department: "CABAÑAS", municipality: "ILOBASCO" },
  //   { department: "CABAÑAS", municipality: "JUTIAPA" },
  //   { department: "CABAÑAS", municipality: "SAN ISIDRO" },
  //   { department: "CABAÑAS", municipality: "TEJUTEPEQUE" },
  //   { department: "CABAÑAS", municipality: "VICTORIA" },
  //   { department: "CHALATENANGO", municipality: "CHALATENANGO" },
  //   { department: "CHALATENANGO", municipality: "AGUA CALIENTE" },
  //   { department: "CHALATENANGO", municipality: "ARCATAO" },
  //   { department: "CHALATENANGO", municipality: "AZACUALPA" },
  //   { department: "CHALATENANGO", municipality: "CANCASQUE" },
  //   { department: "CHALATENANGO", municipality: "CITALÁ" },
  //   { department: "CHALATENANGO", municipality: "COMALAPA" },
  //   { department: "CHALATENANGO", municipality: "CONCEPCIÓN QUEZALTEPEQUE" },
  //   { department: "CHALATENANGO", municipality: "DULCE NOMBRE DE MARÍA" },
  //   { department: "CHALATENANGO", municipality: "EL CARRIZAL" },
  //   { department: "CHALATENANGO", municipality: "EL PARAÍSO" },
  //   { department: "CHALATENANGO", municipality: "LA LAGUNA" },
  //   { department: "CHALATENANGO", municipality: "LA PALMA" },
  //   { department: "CHALATENANGO", municipality: "LA REINA" },
  //   { department: "CHALATENANGO", municipality: "LAS FLORES" },
  //   { department: "CHALATENANGO", municipality: "LAS VUELTAS" },
  //   { department: "CHALATENANGO", municipality: "NOMBRE DE JESÚS" },
  //   { department: "CHALATENANGO", municipality: "NUEVA CONCEPCIÓN" },
  //   { department: "CHALATENANGO", municipality: "NUEVA TRINIDAD" },
  //   { department: "CHALATENANGO", municipality: "OJOS DE AGUA" },
  //   { department: "CHALATENANGO", municipality: "POTONICO" },
  //   { department: "CHALATENANGO", municipality: "SAN ANTONIO DE LA CRUZ" },
  //   { department: "CHALATENANGO", municipality: "SAN ANTONIO LOS RANCHOS" },
  //   { department: "CHALATENANGO", municipality: "SAN FERNANDO" },
  //   { department: "CHALATENANGO", municipality: "SAN FRANCISCO LEMPA" },
  //   { department: "CHALATENANGO", municipality: "SAN FRANCISCO MORAZÁN" },
  //   { department: "CHALATENANGO", municipality: "SAN IGNACIO" },
  //   { department: "CHALATENANGO", municipality: "SAN ISIDRO LABRADOR" },
  //   { department: "CHALATENANGO", municipality: "SAN LUIS DEL CARMEN" },
  //   { department: "CHALATENANGO", municipality: "SAN MIGUEL DE MERCEDES" },
  //   { department: "CHALATENANGO", municipality: "SAN RAFAEL" },
  //   { department: "CHALATENANGO", municipality: "SANTA RITA" },
  //   { department: "CHALATENANGO", municipality: "TEJUTLA" },
  //   { department: "CUSCATLÁN", municipality: "COJUTEPEQUE" },
  //   { department: "CUSCATLÁN", municipality: "CANDELARIA" },
  //   { department: "CUSCATLÁN", municipality: "EL CARMEN" },
  //   { department: "CUSCATLÁN", municipality: "EL ROSARIO" },
  //   { department: "CUSCATLÁN", municipality: "MONTE SAN JUAN" },
  //   { department: "CUSCATLÁN", municipality: "ORATORIO DE CONCEPCIÓN" },
  //   { department: "CUSCATLÁN", municipality: "SAN BARTOLOMÉ PERULAPÍA" },
  //   { department: "CUSCATLÁN", municipality: "SAN CRISTÓBAL" },
  //   { department: "CUSCATLÁN", municipality: "SAN JOSÉ GUAYABAL" },
  //   { department: "CUSCATLÁN", municipality: "SAN PEDRO PERULAPÁN" },
  //   { department: "CUSCATLÁN", municipality: "SAN RAFAEL CEDROS" },
  //   { department: "CUSCATLÁN", municipality: "SAN RAMÓN" },
  //   { department: "CUSCATLÁN", municipality: "SANTA CRUZ ANALQUITO" },
  //   { department: "CUSCATLÁN", municipality: "SANTA CRUZ MICHAPA" },
  //   { department: "CUSCATLÁN", municipality: "SUCHITOTO" },
  //   { department: "CUSCATLÁN", municipality: "TENANCINGO" },
  //   { department: "LA LIBERTAD", municipality: "SANTA TECLA" },
  //   { department: "LA LIBERTAD", municipality: "ANTIGUO CUSCATLÁN" },
  //   { department: "LA LIBERTAD", municipality: "CHILTIUPÁN" },
  //   { department: "LA LIBERTAD", municipality: "CIUDAD ARCE" },
  //   { department: "LA LIBERTAD", municipality: "COLÓN" },
  //   { department: "LA LIBERTAD", municipality: "COMASAGUA" },
  //   { department: "LA LIBERTAD", municipality: "HUIZÚCAR" },
  //   { department: "LA LIBERTAD", municipality: "JAYAQUE" },
  //   { department: "LA LIBERTAD", municipality: "JICALAPA" },
  //   { department: "LA LIBERTAD", municipality: "LA LIBERTAD" },
  //   { department: "LA LIBERTAD", municipality: "NUEVO CUSCATLÁN" },
  //   { department: "LA LIBERTAD", municipality: "QUEZALTEPEQUE" },
  //   { department: "LA LIBERTAD", municipality: "SAN JUAN OPICO" },
  //   { department: "LA LIBERTAD", municipality: "SACACOYO" },
  //   { department: "LA LIBERTAD", municipality: "SAN JOSÉ VILLANUEVA" },
  //   { department: "LA LIBERTAD", municipality: "SAN MATÍAS" },
  //   { department: "LA LIBERTAD", municipality: "SAN PABLO TACACHICO" },
  //   { department: "LA LIBERTAD", municipality: "TALNIQUE" },
  //   { department: "LA LIBERTAD", municipality: "TAMANIQUE" },
  //   { department: "LA LIBERTAD", municipality: "TEOTEPEQUE" },
  //   { department: "LA LIBERTAD", municipality: "TEPECOYO" },
  //   { department: "LA LIBERTAD", municipality: "ZARAGOZA" },
  //   { department: "LA PAZ", municipality: "ZACATECOLUCA" },
  //   { department: "LA PAZ", municipality: "CUYULTITÁN" },
  //   { department: "LA PAZ", municipality: "EL ROSARIO" },
  //   { department: "LA PAZ", municipality: "JERUSALÉN" },
  //   { department: "LA PAZ", municipality: "MERCEDES LA CEIBA" },
  //   { department: "LA PAZ", municipality: "OLOCUILTA" },
  //   { department: "LA PAZ", municipality: "PARAÍSO DE OSORIO" },
  //   { department: "LA PAZ", municipality: "SAN ANTONIO MASAHUAT" },
  //   { department: "LA PAZ", municipality: "SAN EMIGDIO" },
  //   { department: "LA PAZ", municipality: "SAN FRANCISCO CHINAMECA" },
  //   { department: "LA PAZ", municipality: "SAN PEDRO MASAHUAT" },
  //   { department: "LA PAZ", municipality: "SAN JUAN NONUALCO" },
  //   { department: "LA PAZ", municipality: "SAN JUAN TALPA" },
  //   { department: "LA PAZ", municipality: "SAN JUAN TEPEZONTES" },
  //   { department: "LA PAZ", municipality: "SAN LUIS LA HERRADURA" },
  //   { department: "LA PAZ", municipality: "SAN LUIS TALPA" },
  //   { department: "LA PAZ", municipality: "SAN MIGUEL TEPEZONTES" },
  //   { department: "LA PAZ", municipality: "SAN PEDRO NONUALCO" },
  //   { department: "LA PAZ", municipality: "SAN RAFAEL OBRAJUELO" },
  //   { department: "LA PAZ", municipality: "SANTA MARÍA OSTUMA" },
  //   { department: "LA PAZ", municipality: "SANTIAGO NONUALCO" },
  //   { department: "LA PAZ", municipality: "TAPALHUACA" },
  //   { department: "LA UNIÓN", municipality: "LA UNIÓN" },
  //   { department: "LA UNIÓN", municipality: "ANAMORÓS" },
  //   { department: "LA UNIÓN", municipality: "BOLÍVAR" },
  //   { department: "LA UNIÓN", municipality: "CONCEPCIÓN DE ORIENTE" },
  //   { department: "LA UNIÓN", municipality: "CONCHAGUA" },
  //   { department: "LA UNIÓN", municipality: "EL CARMEN" },
  //   { department: "LA UNIÓN", municipality: "EL SAUCE" },
  //   { department: "LA UNIÓN", municipality: "INTIPUCÁ" },
  //   { department: "LA UNIÓN", municipality: "LISLIQUE" },
  //   { department: "LA UNIÓN", municipality: "MEANGUERA DEL GOLFO" },
  //   { department: "LA UNIÓN", municipality: "NUEVA ESPARTA" },
  //   { department: "LA UNIÓN", municipality: "PASAQUINA" },
  //   { department: "LA UNIÓN", municipality: "POLORÓS" },
  //   { department: "LA UNIÓN", municipality: "SAN ALEJO" },
  //   { department: "LA UNIÓN", municipality: "SAN JOSÉ" },
  //   { department: "LA UNIÓN", municipality: "SANTA ROSA DE LIMA" },
  //   { department: "LA UNIÓN", municipality: "YAYANTIQUE" },
  //   { department: "LA UNIÓN", municipality: "YUCUAIQUÍN" },
  //   { department: "MORAZÁN", municipality: "SAN FRANCISCO GOTERA" },
  //   { department: "MORAZÁN", municipality: "ARAMBALA" },
  //   { department: "MORAZÁN", municipality: "CACAOPERA" },
  //   { department: "MORAZÁN", municipality: "CHILANGA" },
  //   { department: "MORAZÁN", municipality: "CORINTO" },
  //   { department: "MORAZÁN", municipality: "DELICIAS DE CONCEPCIÓN" },
  //   { department: "MORAZÁN", municipality: "EL DIVISADERO" },
  //   { department: "MORAZÁN", municipality: "EL ROSARIO" },
  //   { department: "MORAZÁN", municipality: "GUALOCOCTI" },
  //   { department: "MORAZÁN", municipality: "GUATAJIAGUA" },
  //   { department: "MORAZÁN", municipality: "JOATECA" },
  //   { department: "MORAZÁN", municipality: "JOCOAITIQUE" },
  //   { department: "MORAZÁN", municipality: "JOCORO" },
  //   { department: "MORAZÁN", municipality: "LOLOTIQUILLO" },
  //   { department: "MORAZÁN", municipality: "MEANGUERA" },
  //   { department: "MORAZÁN", municipality: "OSICALA" },
  //   { department: "MORAZÁN", municipality: "PERQUÍN" },
  //   { department: "MORAZÁN", municipality: "SAN CARLOS" },
  //   { department: "MORAZÁN", municipality: "SAN FERNANDO" },
  //   { department: "MORAZÁN", municipality: "SAN ISIDRO" },
  //   { department: "MORAZÁN", municipality: "SAN SIMÓN" },
  //   { department: "MORAZÁN", municipality: "SENSEMBRA" },
  //   { department: "MORAZÁN", municipality: "SOCIEDAD" },
  //   { department: "MORAZÁN", municipality: "TOROLA" },
  //   { department: "MORAZÁN", municipality: "YAMABAL" },
  //   { department: "MORAZÁN", municipality: "YOLOAIQUÍN" },
  //   { department: "SAN MIGUEL", municipality: "SAN MIGUEL" },
  //   { department: "SAN MIGUEL", municipality: "CAROLINA" },
  //   { department: "SAN MIGUEL", municipality: "CHAPELTIQUE" },
  //   { department: "SAN MIGUEL", municipality: "CHINAMECA" },
  //   { department: "SAN MIGUEL", municipality: "CHIRILAGUA" },
  //   { department: "SAN MIGUEL", municipality: "CIUDAD BARRIOS" },
  //   { department: "SAN MIGUEL", municipality: "COMACARÁN" },
  //   { department: "SAN MIGUEL", municipality: "EL TRÁNSITO" },
  //   { department: "SAN MIGUEL", municipality: "LOLOTIQUE" },
  //   { department: "SAN MIGUEL", municipality: "MONCAGUA" },
  //   { department: "SAN MIGUEL", municipality: "NUEVA GUADALUPE" },
  //   { department: "SAN MIGUEL", municipality: "NUEVO EDÉN DE SAN JUAN" },
  //   { department: "SAN MIGUEL", municipality: "QUELEPA" },
  //   { department: "SAN MIGUEL", municipality: "SAN ANTONIO" },
  //   { department: "SAN MIGUEL", municipality: "SAN GERARDO" },
  //   { department: "SAN MIGUEL", municipality: "SAN JORGE" },
  //   { department: "SAN MIGUEL", municipality: "SAN LUIS DE LA REINA" },
  //   { department: "SAN MIGUEL", municipality: "SAN RAFAEL ORIENTE" },
  //   { department: "SAN MIGUEL", municipality: "SESORI" },
  //   { department: "SAN MIGUEL", municipality: "ULUAZAPA" },
  //   { department: "SAN SALVADOR", municipality: "SAN SALVADOR" },
  //   { department: "SAN SALVADOR", municipality: "AGUILARES" },
  //   { department: "SAN SALVADOR", municipality: "APOPA" },
  //   { department: "SAN SALVADOR", municipality: "AYUTUXTEPEQUE" },
  //   { department: "SAN SALVADOR", municipality: "CUSCATANCINGO" },
  //   { department: "SAN SALVADOR", municipality: "DELGADO" },
  //   { department: "SAN SALVADOR", municipality: "EL PAISNAL" },
  //   { department: "SAN SALVADOR", municipality: "GUAZAPA" },
  //   { department: "SAN SALVADOR", municipality: "ILOPANGO" },
  //   { department: "SAN SALVADOR", municipality: "MEJICANOS" },
  //   { department: "SAN SALVADOR", municipality: "NEJAPA" },
  //   { department: "SAN SALVADOR", municipality: "PANCHIMALCO" },
  //   { department: "SAN SALVADOR", municipality: "ROSARIO DE MORA" },
  //   { department: "SAN SALVADOR", municipality: "SAN MARCOS" },
  //   { department: "SAN SALVADOR", municipality: "SAN MARTÍN" },
  //   { department: "SAN SALVADOR", municipality: "SANTIAGO TEXACUANGOS" },
  //   { department: "SAN SALVADOR", municipality: "SANTO TOMÁS" },
  //   { department: "SAN SALVADOR", municipality: "SOYAPANGO" },
  //   { department: "SAN SALVADOR", municipality: "TONACATEPEQUE" },
  //   { department: "SAN VICENTE", municipality: "SAN VICENTE" },
  //   { department: "SAN VICENTE", municipality: "APASTEPEQUE" },
  //   { department: "SAN VICENTE", municipality: "GUADALUPE" },
  //   { department: "SAN VICENTE", municipality: "SAN CAYETANO ISTEPEQUE" },
  //   { department: "SAN VICENTE", municipality: "SAN ESTEBAN CATARINA" },
  //   { department: "SAN VICENTE", municipality: "SAN ILDEFONSO" },
  //   { department: "SAN VICENTE", municipality: "SAN LORENZO" },
  //   { department: "SAN VICENTE", municipality: "SAN SEBASTIÁN" },
  //   { department: "SAN VICENTE", municipality: "SANTA CLARA" },
  //   { department: "SAN VICENTE", municipality: "SANTO DOMINGO" },
  //   { department: "SAN VICENTE", municipality: "TECOLUCA" },
  //   { department: "SAN VICENTE", municipality: "TEPETITÁN" },
  //   { department: "SAN VICENTE", municipality: "VERAPAZ" },
  //   { department: "SANTA ANA", municipality: "SANTA ANA" },
  //   { department: "SANTA ANA", municipality: "CANDELARIA DE LA FRONTERA" },
  //   { department: "SANTA ANA", municipality: "CHALCHUAPA" },
  //   { department: "SANTA ANA", municipality: "COATEPEQUE" },
  //   { department: "SANTA ANA", municipality: "EL CONGO" },
  //   { department: "SANTA ANA", municipality: "EL PORVENIR" },
  //   { department: "SANTA ANA", municipality: "MASAHUAT" },
  //   { department: "SANTA ANA", municipality: "METAPÁN" },
  //   { department: "SANTA ANA", municipality: "SAN ANTONIO PAJONAL" },
  //   { department: "SANTA ANA", municipality: "SAN SEBASTIÁN SALITRILLO" },
  //   { department: "SANTA ANA", municipality: "SANTA ROSA GUACHIPILÍN" },
  //   { department: "SANTA ANA", municipality: "SANTIAGO DE LA FRONTERA" },
  //   { department: "SANTA ANA", municipality: "TEXISTEPEQUE" },
  //   { department: "SONSONATE", municipality: "SONSONATE" },
  //   { department: "SONSONATE", municipality: "ACAJUTLA" },
  //   { department: "SONSONATE", municipality: "ARMENIA" },
  //   { department: "SONSONATE", municipality: "CALUCO" },
  //   { department: "SONSONATE", municipality: "CUISNAHUAT" },
  //   { department: "SONSONATE", municipality: "IZALCO" },
  //   { department: "SONSONATE", municipality: "JUAYÚA" },
  //   { department: "SONSONATE", municipality: "NAHUIZALCO" },
  //   { department: "SONSONATE", municipality: "NAHULINGO" },
  //   { department: "SONSONATE", municipality: "SALCOATITÁN" },
  //   { department: "SONSONATE", municipality: "SAN ANTONIO DEL MONTE" },
  //   { department: "SONSONATE", municipality: "SAN JULIÁN" },
  //   { department: "SONSONATE", municipality: "SANTA CATARINA MASAHUAT" },
  //   { department: "SONSONATE", municipality: "SANTA ISABEL ISHUATÁN" },
  //   { department: "SONSONATE", municipality: "SANTO DOMINGO DE GUZMÁN" },
  //   { department: "SONSONATE", municipality: "SONZACATE" },
  //   { department: "USULUTÁN", municipality: "USULUTÁN" },
  //   { department: "USULUTÁN", municipality: "ALEGRÍA" },
  //   { department: "USULUTÁN", municipality: "BERLÍN" },
  //   { department: "USULUTÁN", municipality: "CALIFORNIA" },
  //   { department: "USULUTÁN", municipality: "CONCEPCIÓN BATRES" },
  //   { department: "USULUTÁN", municipality: "EL TRIUNFO" },
  //   { department: "USULUTÁN", municipality: "EREGUAYQUÍN" },
  //   { department: "USULUTÁN", municipality: "ESTANZUELAS" },
  //   { department: "USULUTÁN", municipality: "JIQUILISCO" },
  //   { department: "USULUTÁN", municipality: "JUCUAPA" },
  //   { department: "USULUTÁN", municipality: "JUCUARÁN" },
  //   { department: "USULUTÁN", municipality: "MERCEDES UMAÑA" },
  //   { department: "USULUTÁN", municipality: "NUEVA GRANADA" },
  //   { department: "USULUTÁN", municipality: "OZATLÁN" },
  //   { department: "USULUTÁN", municipality: "PUERTO EL TRIUNFO" },
  //   { department: "USULUTÁN", municipality: "SAN AGUSTÍN" },
  //   { department: "USULUTÁN", municipality: "SAN BUENAVENTURA" },
  //   { department: "USULUTÁN", municipality: "SAN DIONISIO" },
  //   { department: "USULUTÁN", municipality: "SAN FRANCISCO JAVIER" },
  //   { department: "USULUTÁN", municipality: "SANTA ELENA" },
  //   { department: "USULUTÁN", municipality: "SANTA MARÍA" },
  //   { department: "USULUTÁN", municipality: "SANTIAGO DE MARÍA" },
  //   { department: "USULUTÁN", municipality: "TECAPÁN" },
  // ];

  municipios:any[] = [
    {
      "department": "Ahuachapán",
      "municipalities": [
        "Ahuachapán Norte",
        "Ahuachapán Centro",
        "Ahuachapán Sur"
      ]
    },
    {
      "department": "Santa Ana",
      "municipalities": [
        "Santa Ana Norte",
        "Santa Ana Centro",
        "Santa Ana Este",
        "Santa Ana Oeste"
      ]
    },
    {
      "department": "Sonsonate",
      "municipalities": [
        "Sonsonate Norte",
        "Sonsonate Centro",
        "Sonsonate Este",
        "Sonsonate Oeste"
      ]
    },
    {
      "department": "Chalatenango",
      "municipalities": [
        "Chalatenango Norte",
        "Chalatenango Centro",
        "Chalatenango Sur"
      ]
    },
    {
      "department": "La Libertad",
      "municipalities": [
        "La Libertad Norte",
        "La Libertad Centro",
        "La Libertad Oeste",
        "La Libertad Este",
        "La Libertad Costa",
        "La Libertad Sur"
      ]
    },
    {
      "department": "San Salvador",
      "municipalities": [
        "San Salvador Norte",
        "San Salvador Centro",
        "San Salvador Este",
        "San Salvador Oeste",
        "San Salvador Sur"
      ]
    },
    {
      "department": "Cuscatlán",
      "municipalities": [
        "Cuscatlán Norte",
        "Cuscatlán Sur"
      ]
    },
    {
      "department": "La Paz",
      "municipalities": [
        "La Paz Oeste",
        "La Paz Centro",
        "La Paz Este"
      ]
    },
    {
      "department": "Cabañas",
      "municipalities": [
        "Cabañas Oeste",
        "Cabañas Este"
      ]
    },
    {
      "department": "San Vicente",
      "municipalities": [
        "San Vicente Norte",
        "San Vicente Sur"
      ]
    },
    {
      "department": "Usulután",
      "municipalities": [
        "Usulután Norte",
        "Usulután Este",
        "Usulután Oeste"
      ]
    },
    {
      "department": "San Miguel",
      "municipalities": [
        "San Miguel Norte",
        "San Miguel Centro",
        "San Miguel Oeste"
      ]
    },
    {
      "department": "Morazán",
      "municipalities": [
        "Morazán Norte",
        "Morazán Sur"
      ]
    },
    {
      "department": "La Unión",
      "municipalities": [
        "La Unión Norte",
        "La Unión Sur"
      ]
    }
  ]
  
  municipiosFilteres:any[]=[];

  @Input() appendTo:string = 'body';
  @Input() currentDepartment?:string;
  @Input() municipalitySelected: string | null = null;
  @Input() placeholder: string = 'Municipios';


  @Output()changeMunicipality:EventEmitter<string> = new EventEmitter<string>();
  @Output()changeMunicipalityObject:EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['currentDepartment']){
      if(changes['currentDepartment']['previousValue']){
        this.municipalitySelected = null;
      }
      this.filter();
    }
  }

  selectedMunicipality(){
    const municipalityObject = this.municipiosFilteres.find(v=>v.name==this.municipalitySelected);
    this.changeMunicipalityObject.emit(municipalityObject);
    this.changeMunicipality.emit(this.municipalitySelected ? this.municipalitySelected : '');
  }

  filter(){
    if(this.currentDepartment){
      const department = this.municipios.filter((v)=>v.department == this.currentDepartment)
      this.municipiosFilteres = department[0].municipalities
    }else{
      this.clear();
    }
  }

  clear(){
    this.municipalitySelected =null;
    this.municipiosFilteres = [];
  }
}
