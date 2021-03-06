import AIEMeasure from "../AIEMeasure";
export default class Position extends AIEMeasure {
    constructor() {
        super(...arguments);
        this.value = 0;
    }
    toString() {
        return this.value.toString();
    }
    clone() {
        const c = new Position();
        c.value = this.value;
        return c;
    }
    calculate(value) {
        const c = new Position();
        c.value = value;
        return c;
    }
    setValue() {
    }
}
//# sourceMappingURL=Position.js.map