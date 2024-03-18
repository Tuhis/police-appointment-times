import _ from "lodash";
import BaseCard from "../../presentational/BaseCard/BaseCard";
import styles from "./Info.module.css";

export function Info() {
    return (
        <div className={styles["info-container"]}>
            <BaseCard
                autoHeight
                title={"Tietoa"}>

                <h4>Yleistä</h4>
                <p>
                    Ajanvaraaminen poliisille passihakemuksen tekemistä varten vaatii hermoja. Kaikkialla on ruuhkaa
                    ja <a href="https://asiointi.poliisi.fi/ajanvaraus-fe/reserve">varsinainen ajanvaraustyökalu</a> näyttää
                    vain yhden aseman kerrallaan. Hitaasti.
                </p>
                <p>
                    Sivusto listaa kaikki vapaat ajat passihakemuksen jättämiseen valtakunnallisesti seuraavan 12 viikon
                    ajalta. Nopeasti.
                </p>
                <h4>Tekninen toteutus</h4>
                <p>
                    Frontend: React & Redux
                </p>
                <p>
                    Backend: Node.js & Hapi
                </p>
                <p>
                    Lähdekoodi on julkaistu GitHubissa (<a href="https://github.com/Tuhis/police-appointment-times/">
                    https://github.com/Tuhis/police-appointment-times/</a>) avoimen lähdekoodin MIT lisenssin alla.
                </p>
                <p>
                    Backend hakee vapaat ajat ja toimipaikkojen tiedot käyttäen samaa rajapintaa kuin varsinainen
                    ajanvaraustyökalu. Rajapinta <b>ei</b> ole julkisesti dokumentoitu ja siten saattaa muuttua/poistua
                    milloin tahansa. Tämän sivuston alkutaipaleella kyseisen rajapinnan käyttämisen takia poliisi suoritti
                    esitutkinnan Poliisihallituksen rikosilmoituksen perusteella, jossa poliisi.ioio.fi:n ylläpitäjää
                    epäiltiin tietojärjestelmän häirinnästä. Esitutkinta päättyi "Ei rikosta" päätökseen.
                </p>
                <p>
                    Backend hakee tiedot noin 20 minuutin välein ajanvaraustyökalun rajapinnasta tiedot
                    välimuistiin. Täten saavutetaan poliisi.ioio.fi:n nopea vasteaika ja minimoidaan Poliisihallituksen
                    järjestelmiin kohdistuva ylimääräinen rasitus. Samasta syystä johtuen yksittäiset ajat saattavat
                    näkyä vapaina poliisi.ioio.fi:ssä, vaikka todellisuudessa aika on jo varattu.
                </p>
                <p>
                    Poliisin toimipaikkojen ryhmittelemiseksi maakunnittain backend hyödyntää myös Postin julkisesti
                    tarjoamaa ajantasaista postinumerotiedostoa. Lisätietoja <a href="
                    https://www.posti.fi/fi/asiakastuki/postinumerotiedostot">Postin sivuilta.</a>
                </p>
            </BaseCard>
        </div>
    )
}
