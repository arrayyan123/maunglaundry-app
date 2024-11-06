import React from 'react'

function Hero() {
  return (
    <>
        <div class="relative bg-gradient-to-r from-purple-600 to-blue-600 h-screen text-white overflow-hidden">
            <div class="absolute inset-0">
                <img src="https://images.unsplash.com/photo-1522252234503-e356532cafd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NzEyNjZ8MHwxfHNlYXJjaHw2fHxjb2RlfGVufDB8MHx8fDE2OTQwOTg0MTZ8MA&ixlib=rb-4.0.3&q=80&w=1080" alt="Background Image" class="object-cover object-center w-full h-full" />
                <div class="absolute inset-0 bg-black opacity-50"></div>
            </div>
            
            <div class="relative z-10 p-10 flex flex-col justify-center items-center h-full text-center">
                <h1 class="text-5xl font-bold leading-tight mb-4">Maung Perkasa Abadi</h1>
                <p class="text-lg text-gray-300 mb-8">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Itaque consequuntur neque alias maxime, quis dolorem nisi repellendus dolor voluptatum quod in harum ad cum distinctio doloremque error praesentium culpa! Ducimus.</p><br />
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Non nam aspernatur quae nemo incidunt perferendis totam reiciendis, aliquid inventore excepturi autem cum maiores tenetur voluptatibus aperiam neque iusto consectetur? Voluptatum.</p>
                <a href="#" class="bg-red-500 mt-4 text-white hover:bg-red-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg">Get Started</a>
            </div>
        </div>
    </>
  )
}

export default Hero