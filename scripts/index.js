TEN_MILLIONS = 10000000
ONE_HUNDRED_MILLIONS = 100000000

BLUE_LIGHT = "rgb(187,210,245)"
BLUE_MEDIUM = "rgb(118,157,227)"
BLUE_STRONG = "rgb(31,101,228)"


class CountryCollection {
    constructor(items) {
        this.items = items
    }

    first() {
        return new CountryPath(this.items[0])
    }

    find(index) {
        return new CountryPath(this.items[index])
    }

    static get() {
        return new CountryCollection(document.querySelectorAll("path"))
    }


    for(funct) {
        this.items.forEach(countryPath => { funct(new CountryPath(countryPath)) }
        )
    }
}

class CountryPath {
    constructor(element) {
        this.element = element
        this.setTooltip(`${this.name()}`)  // Mejora para incluir el nombre
    }

    fill(color) {
        this.element.setAttribute("fill", color)
    }

    name() {
        return this.element.getAttribute('id') // Asegurarse de que el nombre coincida con la API
    }

    setPopulation(population) {
        this.element.setAttribute("population", population)
    }

    setTooltip(string) {
        this.element.setAttribute('title', string);
    }

    static findByName(name) {
        return new CountryPath(document.getElementById(name))
    }

}


class Response {
    constructor(object) {
        this.object = object
    }

    population() {
        return this.object.population || 0  // Asegura que la población esté presente
    }
    name() {
        return this.object.name.common || 'Desconocido'  // Extraemos el nombre común
    }
    region() {
        return this.object.region
    }
    subregion() {
        return this.object.subregion
    }
    area() {
        return this.object.population
    }
}


class CountryAPI {

    static async findByName(name) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/name/${name}`)

            if (response.status === 404) {
                console.error(`Country ${name} not found`)
                return null
            }

            const data = await response.json()
            if (!data || data.length === 0) {
                console.error(`No data found for ${name}`)
                return null
            }

            return new Response(data[0])
        } catch (error) {
            console.error(`Error fetching data for ${name}:`, error)
            return null
        }
    }
}


CountryCollection.get().for(async countryPath => {
    const name = countryPath.name()
    console.log(`Fetching data for country: ${name}`)  // Depuración para ver el nombre del país

    const response = await CountryAPI.findByName(name)
    if (!response) {
        countryPath.setTooltip(`${name} - Población no disponible`)
        return
    }

    const population = response.population()
    const countryName = response.name()


    // Función para generar colores hexadecimales aleatorios
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Obtener todos los elementos "path" del mapa y asignarles un color aleatorio
CountryCollection.get().for(countryPath => {
    const randomColor = getRandomColor(); // Genera un color aleatorio
    countryPath.fill(randomColor); // Aplica el color al país
});


    // Actualizamos el tooltip para mostrar el nombre y la población
    countryPath.setTooltip(`${countryName} - Población: ${population.toLocaleString()}`)

  
})
