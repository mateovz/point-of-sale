import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'listFilter'})
export class ListFilterPipe implements PipeTransform {
    public transform(list: any[], filterText: string, filterBy?:string): any[] {
        if(!list) return [];
        if( !filterText) return list;
        if(filterBy){
            return this.filterBy(list, filterText, filterBy);
        }else{
            return this.filterDefault(list, filterText);
        }
    }
    
    private filterDefault(list: any[], filterText: string): any[]{
        return list.filter(item => {
            const key = Object.keys(item).find(key => key !== 'id') || '';
            return item[key].search(new RegExp(filterText, 'i')) > -1;
        });
    }

    private filterBy(list: any[], filterText: string, filterBy: string): any[]{
        return list.filter(item => {
            if(Array.isArray(item[filterBy])){
                return this.filterArray(item[filterBy], filterText);
            }else{
                return item[filterBy].search(new RegExp(filterText, 'i')) > -1;
            }
        });
    }

    private filterArray(item: any[], filterText: string){
        return JSON.stringify(item)
            .toLowerCase()
            .includes(filterText.toLowerCase());
    }
}