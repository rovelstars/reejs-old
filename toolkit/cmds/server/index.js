import { createServer } from 'http';
import { createApp } from '../../libs/h3/index.js'
import color from '../../libs/@reejs/colors/index.js'

const app = createApp();
app.use('/', () => 'Hello world!')
createServer(app).listen(parseInt("8000"), () => {
    console.log(`[INFO] Listening on port ${color("8000", "green")}`)
});