import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout, initContract } from './utils'
import './global.css'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
  // use React Hooks to store greeting in component state
  const [production, setProduction] = React.useState()
  const [receiver, setReceiver]= React.useState('');
  const [message, setMessage] = React.useState('');

  const [personalProfile, setPersonalProfile] = React.useState(-1)
  const [profiles, setProfiles] = React.useState()

  const [messages, setMessages] = React.useState()
  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)

  const handleNewAccount = async (e) => {
    
    let res = await window.contract.createProfile({_userName:e.target.username.value, _age:parseInt(e.target.age.value), _publicDescription:e.target.description.value, _profileId:window.walletConnection.account().accountId});
    
    let personalProfile = await window.contract.getProfile({_profileId: window.walletConnection.account().accountId})
    setPersonalProfile(personalProfile);
    alert(res);
  }

  const getMessages = async (_receiver) => {
    console.log(_receiver)
    let res = await window.contract.getMessages({receiver:_receiver});
    console.log(res)
    setMessages(res);
  }

  const updateMessageContent = async (e) => {
    e.preventDefault();
    setMessage(e.target.value);
  }

  const sendMessage = () => {
    window.contract.addMessage({receiver: receiver, message: message});
  }

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
   React.useEffect(
     async() => {
      //we only care to query the contract when signed in
      if (!profiles) {
         let profiles = await window.contract.getProfiles();
        setProfiles(profiles);
      }

        let personalProfile = await window.contract.getProfile({_profileId: window.walletConnection.account().accountId})
        setPersonalProfile(personalProfile);
        return;
     },
    []
  ) 

  // if not signed in, return early with sign-in prompt
  if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>DA_Facebook!</h1>
        <p>
          To use Da_Facebook, you need to sign in, then, create a profile if you are a new user.
        </p>
        <p>
          Go ahead and click the button below to try it out:
        </p>
        <p style={{ textAlign: 'center', marginTop: '2.5em' }}>
          <button onClick={login}>Sign in</button>
        </p>
      </main>
    )
  }

  if(personalProfile===-1)
    return <div><p>...loading...</p></div>
  else if(!personalProfile){
    return (<><button className="link" style={{ float: 'right' }} onClick={()=>logout}>
          Sign out
        </button>
        <main>
        <h1>
          <label
            htmlFor="production"
            style={{
              color: 'var(--primary)',
              borderBottom: '2px solid var(--primary)'
            }}
          >Please, create an account!
          </label>
          {' '/* React trims whitespace around tags; insert literal space character when needed */}
        {/*   {window.accountId}! */}
        </h1><div className="w-full max-w-xs">
    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleNewAccount}>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username
        </label>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Profile Descriptioin
        </label>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" placeholder="Profile Description" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
          Age
        </label>
        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="age" type="number" placeholder="Age" />
      </div>
      <div className="flex items-center justify-between">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
          Create Account
        </button>
      </div>
    </form>
    <p className="text-center text-gray-500 text-xs">
      &copy;2020 DA_Facebook. All rights reserved.
    </p>
    {/* //_userName:string, _age:i16, _publicDescription?:string, _profileId?:string */}
  </div>
      </main></>)
  }

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <button className="link" style={{ float: 'right' }} onClick={()=>logout}>
        Sign out
      </button>
      <main className='flex-col'>
        <h1 className='grow'>
          <label
            htmlFor="production"
            style={{
              color: 'var(--primary)',
              borderBottom: '2px solid var(--primary)'
            }}
          >
          </label>
          {' '/* React trims whitespace around tags; insert literal space character when needed */}
        {/*   {window.accountId}! */}
        </h1>
        <div className='flex justify-around'>
          <div>
            {profiles&&profiles.map((profile)=>{
            return <div className="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20 cursor-pointer" key={profile.profileId} onClick={()=>getMessages(profile.profileId)}>
              <div className="flex justify-center md:justify-end -mt-16">
                <img className="w-20 h-20 object-cover rounded-full border-2 border-indigo-500" src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80" />
              </div>
              <div>
                <h2 className="text-gray-800 text-3xl font-semibold">{profile.userName}</h2>
                <p className="mt-2 text-gray-600">{profile.publicDescription}</p>
              </div>
              <div className="flex justify-end mt-4">
                <div className="text-xl font-medium text-indigo-500">{profile.age}</div>
              </div>
            </div>
          })}
        </div>
        <div className='flex-col'>
          {messages&&messages.map((message, index)=>{
            return <div className="max-w-md py-4 px-8 bg-white shadow-lg rounded-lg my-20"><p className="mt-2 text-gray-600" key={index}>{message.sender}</p></div>
          })}
        </div>
      </div>
        <form onSubmit={async event => {
          event.preventDefault()
          fieldset.disabled = false
          // update local `greeting` variable to match persisted value
          setProduction({_isProduction:true})
          // show Notification
          setShowNotification(true)
          // remove Notification again after css animation completes
          // this allows it to be shown again next time the form is submitted
          setTimeout(() => {
            setShowNotification(false)
          }, 11000)
        }} className='border border-gray-400 px-4 py-2 pr-8 rounded'>
        <label  htmlFor="message">
          Send Message
        </label>
        <label>
          Receiver
        </label>
        <select className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" onChange={(e)=>{console.log(e.target.value);setReceiver(e.target.value)}}>
          {profiles.map((profile)=>{return <option key={profile.profileId} value={profile.profileId}>id: {profile.profileId}</option>})}
        </select>
          <fieldset id="fieldset">
            <div style={{ display: 'flex' }}>
              <input
                autoComplete="off"
                defaultValue={production}
                id="message"
                onChange={e => updateMessageContent(e)}
                style={{ flex: 1 }}
              />
              <button onClick={()=>sendMessage()} >
                Send
              </button>
            </div>
          </fieldset>
        </form>
        <hr />
      </main>
      {showNotification && <Notification />}
    </>
  )
}

// this component gets rendered by App after the form is submitted
function Notification() {
  const urlPrefix = `https://explorer.${networkId}.near.org/accounts`
  return (
    <aside>
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.accountId}`}>
        {window.accountId}
      </a>
      {' '/* React trims whitespace around tags; insert literal space character when needed */}
      called method: 'X' in contract:
      {' '}
      <a target="_blank" rel="noreferrer" href={`${urlPrefix}/${window.contract.contractId}`}>
        {window.contract.contractId}
      </a>
      <footer>
        <div>✔ Succeeded</div>
        <div>Just now</div>
      </footer>
    </aside>
  )
}
