import { html, Component } from "/reender.js";
import Modal from "/pages/components/Modal.js";
import BotCard from "/pages/components/BotCard.js";

export let meta = {
  title: "Failure",
  description: "This is the failure page",
  og_image: "https://i.imgur.com/qJ5QlQH.png",
  og_image_width: "1200",
  og_image_height: "630",
  og_image_type: "image/png",
  og_image_alt: "Failure Page",
  og_type: "website",
  og_url: "https://ree.rovel.workers.dev/failure",
}

export default class Failure extends Component {

  componentDidMount(){
    this.state = {
      show: false
    };
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };
  render({props}) {
    return html`<p className="mx-4 text-indigo-500">
        Welcome to <span className="text-indigo-600">Failure!</span>
      </p>
      <a className="btn-green" href="/" data-scroll=${true}>Go Home!</a>
      <button className="btn-red" onclick=${this.showModal}>Open Modal!</button>
      ${html`<${Modal} show=${this.state.show} handleClose=${this.hideModal} />`}
      <div
        className="mx-4 mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        <${BotCard} /><${BotCard} /><${BotCard} />
        <${BotCard} /><${BotCard} /><${BotCard} />
      </div>`;
  }
}
