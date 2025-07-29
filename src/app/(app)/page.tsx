'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import messages from '../../../src/messages.json'
import { Mail } from "lucide-react"

const Home = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-16 bg-black min-h-screen relative overflow-hidden">
        {/* Lighting Effects */}
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-gray-800 rounded-full filter blur-[100px] opacity-5 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gray-800 rounded-full filter blur-[120px] opacity-5 pointer-events-none"></div>
        <div className="absolute top-1/3 left-0 w-[200px] h-[200px] bg-gray-700 rounded-full filter blur-[80px] opacity-5 pointer-events-none"></div>
        
        {/* Hero Section */}
        <section className="text-center mb-12 md:mb-20 max-w-3xl relative z-10">
          <div className="inline-block bg-gray-900/50 px-4 py-1.5 rounded-full mb-6 border border-gray-800 backdrop-blur-sm">
            <span className="text-gray-400 text-xs font-medium tracking-wider">
              ANONYMOUS MESSAGING PLATFORM
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light leading-tight mb-6 text-gray-100">
            Dive into the World of <br />
            <span className="font-semibold text-white">Anonymous Feedback</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            Where honest conversations happen without revealing identities.
            <br />
            Share and receive feedback with complete anonymity.
          </p>
        </section>

        {/* Testimonial Carousel */}
        <div className="w-full max-w-2xl xl:max-w-4xl relative z-10">
          <Carousel
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
            opts={{ loop: true, align: "start" }}
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-3">
                  <Card className="h-full bg-gray-900/50 border border-gray-800 hover:border-gray-700 transition-all duration-300 group backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-base font-medium text-gray-200 group-hover:text-white transition-colors">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-3 md:space-y-0 md:space-x-4">
                      <div className="p-2 bg-gray-900/50 rounded-full border border-gray-800 group-hover:bg-gray-800/30 transition-colors">
                        <Mail className="text-gray-400 group-hover:text-gray-300" size={18} />
                      </div>
                      <div>
                        <p className="text-gray-300 font-light text-sm leading-relaxed">{message.content}</p>
                        <p className="text-xs text-gray-500/80 mt-3 font-mono">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Custom Carousel Controls */}
            <div className="mt-8 flex justify-center gap-3">
              <CarouselPrevious className="relative left-0 top-0 -translate-y-0 transform-none border border-gray-800 bg-gray-900/70 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-700 backdrop-blur-sm" />
              <CarouselNext className="relative right-0 top-0 -translate-y-0 transform-none border border-gray-800 bg-gray-900/70 text-gray-300 hover:bg-gray-800 hover:text-white hover:border-gray-700 backdrop-blur-sm" />
            </div>
          </Carousel>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 bg-black border-t border-gray-800/50 backdrop-blur-lg">
        <div className="container mx-auto">
          <p className="text-sm text-gray-500/80">
            © 2025 True Feedback. All rights reserved.
          </p>
          {/* <div className="mt-2 flex justify-center gap-4">
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              Contact
            </a>
          </div> */}
        </div>
      </footer>
    </>
  )
}

export default Home