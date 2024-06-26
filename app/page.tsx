import styles from "./page.module.css";
import { StanzaDict, getMetaAndContent } from "./lib/parser";
import { cutive_mono } from "@/app/fonts";

interface StanzaProps {
    lines: string[],
    classes: string[]
}

interface PoemProps {
    stanzaDict: StanzaDict
}


const Stanza = ({lines, classes}: StanzaProps) => {
    const classList = classes.join(' ');
    return (
        <div className={`stanza ${classList}`}>
        {lines.map((line, index) => <p dangerouslySetInnerHTML={{__html: line}} key={index}></p>)}
        </div>
    )
}

const Poem = ({stanzaDict}: PoemProps) => {
    return (
        <div className={`poem-container ${cutive_mono.className}`}>
            {Object.keys(stanzaDict).map((key) => (
                <Stanza key={key} lines={stanzaDict[key].lines} classes={stanzaDict[key].classes} />
            ))}
        </div>
    )
}


export default function Home() {
    const poem_name = 'newer_poem'
    const PATH = `/Users/tom/Code/websites/art-site/public/poems/src/${poem_name}.pml`
    const [meta, poem] = getMetaAndContent(PATH);
  return (
    <main className={styles.main}>
        <div className={styles.metablock}>
            <h1>{meta.title}</h1>
            <p>By {meta.by}</p>
            <p>{meta.date}</p>
        </div>
        <Poem stanzaDict={poem} />
    </main>
  );
}
