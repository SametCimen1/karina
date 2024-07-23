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
  const [error, setError] = useState('');



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
    let selectedVoice = 4;
    const newVoices = synth.getVoices();
    for(let i = 0; i<newVoices.length; i++){
      if(newVoices[i].name === "Samantha"){
        selectedVoice = i;
      }
    }

    utterance.voice = synth.getVoices()[selectedVoice];

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
      setError("Please enter a valid input")
      setTimeout(() => {
        setError("")
      },3000)
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
      {/* <div className="max-z-index w-screen h-screen bg-black/85 absolute">
        <Button></Button>
      </div> */}
      {error.length > 0  &&
        <div className="absolute w-screen text-center mt-5">
          <span className="bg-red-400  p-2 rounded-full text-white">{error}</span>
        </div>
      }
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
                <div className="mb-2 animate-pulse">
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
                          <AccordionTrigger>How does it work?</AccordionTrigger>
                          <AccordionContent>
                            When you send a question to the backend, it makes a request to ChatGPT API and then returns what the API returned to the front-end
                            and the front-end tries to use speech API to say the response outloud.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>What can it do?</AccordionTrigger>
                          <AccordionContent>
                            It can basically do anything that you can do with normal ChatGPT, the only difference is that this app uses ChatGPT-3.5 Turbo.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>Next Steps?</AccordionTrigger>
                          <AccordionContent>
                            The next steps for this project is to add talking animations and much more.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4">
                          <AccordionTrigger>Source Code</AccordionTrigger>
                          <AccordionContent>
                            You can see the github repository <Link className="text-blue-500" href = "https://github.com/sametcimen1/karina">here</Link>
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
