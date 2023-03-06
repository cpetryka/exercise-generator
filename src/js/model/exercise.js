class Exercise {
    #unit;
    #subsection;
    #exerciseNumber;

    constructor(unit, subsection, exerciseNumber) {
        this.#unit = unit;
        this.#subsection = subsection;
        this.#exerciseNumber = exerciseNumber;
    }

    generateExercisesId() {
        return `${unit}_${subsection}_${exerciseNumber}`;
    }
}