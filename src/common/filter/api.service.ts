import { Query } from "mongoose";
import { Injectable } from "@nestjs/common";

export interface IQuery {
    page?:string;
    sort?:string;
    select?:string;
    limit?:string;
    keyword?:string;
};
export interface Pagination {
    currentPage?:number;
    previousPage?:number;
    nextPage?:number;
    numOfPages?:number;
    skip?:number;
    limit?:number;
};

@Injectable()
export class ApiService< T , I extends IQuery > {
    query:Query< T[] , T >; 
    private queryObj:I;
    public paginationObj:Pagination={};
    private filter( ){
        let filter={ ... this.queryObj  };
        let fields : ('keyword'|'page'|'limit'|'select'|'sort')[]=['keyword','page','limit','select','sort'];
        fields.forEach( (field  ) => { delete filter[field] } );
        let queryStr=JSON.stringify(filter);
        queryStr=queryStr.replace( /lt|gt|lte|gte/ig , val => `$${val}` );
        filter=JSON.parse(queryStr);
        console.log(filter,"filter");
        this.query=this.query.find({ ... filter });
        return this;
    };
    private sort(){
        if(this.queryObj.sort){
            const sort= this.queryObj.sort.split(',').join(' ');
            this.query=this.query.sort(sort);
        }else{
            this.query=this.query.sort("-createdAt");
        };
        return this;
    };
    private select(){
        if(this.queryObj.select){
            const select= this.queryObj.select.split(',').join(' ');
            this.query=this.query.select(select);
        };
        return this;
    };
    private search( fields?:string[] ){
        if( this.queryObj.keyword && fields?.length > 0 ) {
            const value={ $regex: this.queryObj.keyword , $options: 'i'  }
            const filter={ $or : [  ] };
            fields.map((field)=>{
                filter["$or"].push({ [ field ] : value });
            });
            this.query=this.query.find(filter);
        };
        return this;
    };
    private async pagination(){
        this.paginationObj.numOfPages= (await (this.query.model.find({ ... this.query.getQuery() }))).length;
        this.paginationObj.currentPage=this.queryObj.page ? parseInt( this.queryObj.page ) : 1 ;
        this.paginationObj.limit=this.queryObj.limit ? parseInt(this.queryObj.limit) : 10 ;
        this.paginationObj.skip= ( this.paginationObj.currentPage - 1 ) * this.paginationObj.limit ;
        if( this.paginationObj.currentPage > 1){
            this.paginationObj.previousPage=this.paginationObj.currentPage - 1;
        };
        if( this.paginationObj.numOfPages > this.paginationObj.currentPage * this.paginationObj.limit ){
            this.paginationObj.nextPage=this.paginationObj.currentPage+1;
        };
        this.query=this.query.skip(this.paginationObj.skip).limit(this.paginationObj.limit);
        return this;
    };
    getAllDocs( query:Query< T[] , T > , queryObj:I , fields?:string[]  )
        : Promise< { query : Query<T[],T> ; paginationObj:Pagination } > 
    {
        this.query = query;
        this.queryObj = queryObj;
        return this.filter().sort().select().search(fields).pagination();
    };
    getAllDocsWithoutFilter( query:Query< T[] , T > , queryObj:I , fields?:string[]  )
        : Promise< { query : Query<T[],T> ; paginationObj:Pagination } > 
    {
        this.query = query;
        this.queryObj = queryObj;
        return this.sort().select().search(fields).pagination();
    };
};