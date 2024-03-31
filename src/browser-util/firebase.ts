import firebase from 'firebase'
import 'firebase/database'
import { Configschema } from '../../configschema'

const config = nodecg.bundleConfig as Configschema

const firebaseConfig = config.firebaseConfig
const logger = new nodecg.Logger(`${nodecg.bundleName}:firebase`)

let db: firebase.database.Database | null = null

try {
    firebase.initializeApp(firebaseConfig)
    
    firebase
        .auth()
        .signInAnonymously()
        .then(() => {
            logger.info('Signed in to Firebase')
        })
        .catch((error) => {
            logger.error('Failed to login to Firebase', error)
        })
    nodecg.log.warn(`the loaded firebase database`, firebase.database())
    db = firebase.database()
} catch (error) {
    logger.error('Failed to initialize Firebase', error)
}

export const fb = db
