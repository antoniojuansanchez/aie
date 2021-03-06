import AIEMeasure from "../AIEMeasure";
export default class Position extends AIEMeasure {
    protected value: number = 0

    public toString() {
        return this.value.toString()
    }
    public clone(): AIEMeasure {
        const c = new Position()
        c.value = this.value
        return c
    }
    public calculate (value: number): AIEMeasure {
        const c = new Position()
        c.value = value
        return c
    }
    public setValue () {
    }
}