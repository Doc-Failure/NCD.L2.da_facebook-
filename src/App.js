import 'regenerator-runtime/runtime'
import React from 'react'
import { login, logout } from './utils'
import './global.css'

import getConfig from './config'
const { networkId } = getConfig(process.env.NODE_ENV || 'development')

export default function App() {
  // use React Hooks to store greeting in component state
  const [production, setProduction] = React.useState()

  const [profiles, setProfiles] = React.useState()

  const [messages, addMessage] = React.useState()
  // when the user has not yet interacted with the form, disable the button
  const [buttonDisabled, setButtonDisabled] = React.useState(true)

  // after submitting the form, we want to show Notification
  const [showNotification, setShowNotification] = React.useState(false)

  // The useEffect hook can be used to fire side-effects during render
  // Learn more: https://reactjs.org/docs/hooks-intro.html
   React.useEffect(
    async () => {
      let awa_res =  await window.contract.getProfiles();
      setProfiles(awa_res);
     /*  awa_res.map((value)=>{
        console.log(value)
      }) */
      // in this case, we only care to query the contract when signed in
      //if (window.walletConnection.isSignedIn()) {
     },
    []
  ) 

  // if not signed in, return early with sign-in prompt
 if (!window.walletConnection.isSignedIn()) {
    return (
      <main>
        <h1>Welcome to NEAR!</h1>
        <p>
          To make use of the NEAR blockchain, you need to sign in. The button
          below will sign you in using NEAR Wallet.
        </p>
        <p>
          By default, when your app runs in "development" mode, it connects
          to a test network ("testnet") wallet. This works just like the main
          network ("mainnet") wallet, but the NEAR Tokens on testnet aren't
          convertible to other currencies – they're just for testing!
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

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      {profiles&&profiles.map((profile)=>{
        return <div key={profile.profileId}>{profile.userName + " " + profile.age + " "+ profile.publicDescription©©©}</div>
      })}
      <button className="link" style={{ float: 'right' }} onClick={logout}>
        Sign out
      </button>
      <main>
        <h1>
          <label
            htmlFor="production"
            style={{
              color: 'var(--secondary)',
              borderBottom: '2px solid var(--secondary)'
            }}
          >
          </label>
          {' '/* React trims whitespace around tags; insert literal space character when needed */}
        {/*   {window.accountId}! */}
        </h1>
        <form onSubmit={async event => {
          event.preventDefault()

          fieldset.disabled = false

          console.log(production);
          console.log(messages)
          console.log(profiles)
          // update local `greeting` variable to match persisted value
          setProduction({_isProduction:true})

          // show Notification
          setShowNotification(true)

          // remove Notification again after css animation completes
          // this allows it to be shown again next time the form is submitted
          setTimeout(() => {
            setShowNotification(false)
          }, 11000)
        }}>
          <fieldset id="fieldset">
            <label
              htmlFor="production"
              style={{
                display: 'block',
                color: 'var(--gray)',
                marginBottom: '0.5em'
              }}
            >
              Change greeting
            </label>
            <div style={{ display: 'flex' }}>
              <input
                autoComplete="off"
                defaultValue={production}
                id="production"
               /*  onChange={e => setButtonDisabled(buttonDisabled)} */
                style={{ flex: 1 }}
              />
              <button
                /* disabled={buttonDisabled} */
                style={{ borderRadius: '0 5px 5px 0' }}
              >
                Save
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
