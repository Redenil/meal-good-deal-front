import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'evenodd' })
export class EvenOddPipe implements PipeTransform {
    transform(value: any[], filter: string) {
        if (!value || (filter !== "even" && filter !== "odd")) {
            return value;
        }
        return value.filter((item, index) => {
            if (filter === "even") {
                return index % 2 === 0;
            }
            return index % 2 === 1;
        });
    }
}