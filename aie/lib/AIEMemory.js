export default class AIEMemory {
    constructor(id) {
        this.id = id;
        this.score = this.loadScoreFromStore(id);
    }
    setId(id) {
        this.id = id;
        this.saveScoreToStore(id, this.score);
    }
    anoteEvent(goal = 1) {
        this.score += goal;
        this.saveScoreToStore(this.id, this.score);
    }
    getScore() {
        return this.score;
    }
    setScore(score) {
        return this.score = score;
        this.saveScoreToStore(this.id, this.score);
    }
}
//# sourceMappingURL=AIEMemory.js.map