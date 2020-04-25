//referências: https://carloslevir.com/aplicacao-desktop-react-electron/
import React from "react"
import ReactDOM from "react-dom"
import Requisicao from './requisicao'
import VideoPlayer from 'react-videoplayer'
import 'react-videoplayer/lib/index.css'

class Index extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            playlist: [],
            videoFiles: [],
            videoSrc: "",
            currentVideo: -1,
            previousButtonClassName: "",
            nextButtonClassName: ""
        }
        this.videoPlayerPlayNext = this.videoPlayerPlayNext.bind(this);
        this.videoPlayerPlayPrevious = this.videoPlayerPlayPrevious.bind(this);
        this.carregarNovos = this.carregarNovos.bind(this)
    }
    /** */
    videoPlayerPlayNext() {
        if (this.state.currentVideo === this.state.playlist.length - 1) {
            return;
        }
        else {
            this.setState((prevState) => {
                const currentVideo = prevState.currentVideo + 1;
                const className = currentVideo === prevState.playlist.length - 1 ? "disabled" : "";
                return {
                    currentVideo,
                    videoSrc: prevState.playlist[currentVideo],
                    nextButtonClassName: className,
                    previousButtonClassName: ""
                };
            });
        }
    }
    /** */
    videoPlayerPlayPrevious() {
        if (this.state.currentVideo === 0) {
            return;
        }
        else {
            this.setState((prevState) => {
                const currentVideo = prevState.currentVideo - 1;
                const className = currentVideo === 0 ? "disabled" : "";
                return {
                    currentVideo,
                    videoSrc: prevState.playlist[currentVideo],
                    previousButtonClassName: className,
                    nextButtonClassName: ""
                };
            });
        }
    }
    /** */
    carregarNovos() {
        Requisicao({ page: 1 }).then( (resultado) => {
            let lista = resultado.videos.map((video)=>{return video.url})
            this.setState({
                playlist: lista,
                paginacao: resultado.pagination
            })
            //TODO - console.log("DADOS CARREGADOR: ", this.state.playlist)
        })
    }
    /** */
    render (){
        
        console.log('VIDEOS',this.state.playlist)
        return (
            <div>
                <h1>PLAY LIST</h1>
                <ul>
                    <li onClick={() => this.carregarNovos()}>Novos</li>
                    <li>Melhores</li>
                    <li>Favoritos</li>
                </ul>
                <VideoPlayer
                    videoSrc={this.state.videoSrc}
                    playNext={this.videoPlayerPlayNext}
                    playPrevious={this.videoPlayerPlayPrevious}
                    autoPlay={true}
                    playlist={this.state.playlist.length > 1}
                    onEnded={this.videoPlayerPlayNext}
                    defaultBrowserControls={true}
                />
            </div>
        );
    }
}
ReactDOM.render(<Index/>, document.getElementById('root'))