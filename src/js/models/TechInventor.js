export { TechInventor }

/**
 * Tech inventor class
 */
class TechInventor{
    name;
    tech;
    age;

    constructor(name, tech, age){
        this.name = name;
        this.tech = tech;
        this.age = this.CalculateAge(age.Birth, age.Death)
    }

    /**
     * Calculates age from birth and death dates
     * 
     * @param {date} birth birth date
     * @param {date} death death date
     * @returns age
     */
    CalculateAge(birth, death = null)
    {
        const yearInMiliseconds = 31556952000;
        
        let age = death == null 
            ? Math.floor((Date.now() - Date.parse(birth)) / yearInMiliseconds)
            : Math.floor((Date.parse(death) - Date.parse(birth)) / yearInMiliseconds);

        return age;
    }
}