'use client'
import Image from "next/image";
import { useAction } from "next-safe-action/hooks";
import { testMethod } from "@/server/actions/test";
import { useState, useEffect, KeyboardEvent } from "react";
import { Face } from "./components/Face";
import VoiceSelector from "./VoiceSelector";
import Link from "next/link";
import { Instagram, X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import { Suspense } from 'react';
import {Skeleton} from "./Skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

let synth: SpeechSynthesis;
let isCurrentlySpeaking = false;

export default function Home() {
  const [message, setMessage] = useState("");
  const [textValue, setTextValue] = useState({textValue:""});
  const [selectedVoice, setSelectedVoice] = useState<number>(4);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  const {execute, status} = useAction(testMethod, {
    onSuccess(data:any){
      if(data){
        setMessage(data.data)
        setIsWaiting(false);
      }
    }
  })

  useEffect(() => {
    console.log('synth update')
    synth = window.speechSynthesis;
    console.log(synth)
  }, [])

  const speak = (textValue:string) => {

    synth = window.speechSynthesis;

    const utterance = new SpeechSynthesisUtterance(textValue);
    utterance.voice = synth.getVoices()[4];

    synth.speak(utterance);
    if(synth.speaking){
      setIsSpeaking(true);
    }
  };

  const onKeyDown  = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) {
      onsubmit();
    }
  };

  useEffect(() => {
    if(message.length > 0){
      speak(message)
    }
    else{
      stopSpeaking()
    }
  }, [message])

  function onsubmit(){
    if(textValue.textValue.length<1){
      alert("please enter a valid input")
    }else{
      setTextValue({textValue:""});
      setMessage("");
      setIsWaiting(true);
      execute(textValue);
    }
  }


  useEffect(() => {
    if(isSpeaking){
      console.log("currently speaking")
      let interval = setInterval(() => {
        console.log("currently speaking1")
        if(!synth.speaking){
          console.log("currently speaking2")
          setIsSpeaking(false);
          clearInterval(interval);
        }
      },1500)
    }
  },[isSpeaking])


  function stopSpeaking(){
    if(synth!== undefined && synth.speaking){
      synth.cancel();
    }

  }



  return (
    <main className="">
      <div className="">
        <div className="absolute h-screen z-50 w-36 sm: flex justify-center">
          <div className="mt-20 ">

          </div>
        </div>
        <div className="bottom-0 absolute z-50  w-screen mb-20 flex flex-col ">
            <div className="w-full flex flex-col items-center">
              {message &&
                <div className="w-3/4 lg:max-w-max relative">
                  <span className="absolute left-full -mt-1 hover:cursor-pointer text-muted-foreground" onClick={() => setMessage("")}><X size={20}/></span>
                  <p className="bg-gray-100  text-gray-800 text-xs font-medium me-2 px-2.5 py-1.5 p-3 text-center rounded-full dark:bg-gray-700 dark:text-gray-300 mb-3 w-full">{message}</p>
                </div>
              }
              {isWaiting &&
                <div>
                  <p>Waiting for response...</p>
                </div>
              }
              <div className="flex justify-center align-center w-full ">
                <input type="text" id="first_name" className="z-99 w-1/2  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="How may I help you?"
                  required
                  value= {textValue.textValue}
                  onChange={(e) => setTextValue({textValue:e.target.value})}
                  onKeyDown={
                    (e) => {
                      onKeyDown(e);
                    }
                  }

                  />
                {!isSpeaking ?
                  <button className="bg-blue-500 rounded-lg p-3 ml-2 text-white" onClick={() => onsubmit()}>Send</button>
                  :
                  <button className="bg-red-500 rounded-lg p-3 ml-2 text-white" onClick={() => stopSpeaking()}>Stop</button>
                }
              </div>
            </div>
            {/* <VoiceSelector selected={selectedVoice} setSelected={setSelectedVoice} /> */}
            <div className="z-auto  mt-2   m-auto  ">
              <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger className="">
                      <span className=" rounded-lg p-3 text-muted-foreground">How to use?</span>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle className="text-center">Welcome to Karina.app</DrawerTitle>
                        <DrawerDescription className="text-center">A virtual assisant to help you</DrawerDescription>
                      </DrawerHeader>
                      <Accordion type="single" collapsible className="w-full px-5">
                        <AccordionItem value="item-1">
                          <AccordionTrigger>Is it accessible?</AccordionTrigger>
                          <AccordionContent>
                            Yes. It adheres to the WAI-ARIA design pattern.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>Is it styled?</AccordionTrigger>
                          <AccordionContent>
                            Yes. It comes with default styles that matches the other
                            components&apos; aesthetic.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>Is it animated?</AccordionTrigger>
                          <AccordionContent>
                            Yes. It&apos;s animated by default, but you can disable it if you
                            prefer.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </DrawerContent>
              </Drawer>
            </div>
        </div>

      </div>

      <div className={`${isDrawerOpen ? "hidden" : ""} `}>
        <Face/>
      </div>

    </main>
  );
}
