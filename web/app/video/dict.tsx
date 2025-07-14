import { WordEntry } from "@/model/dict";

export default function Dict({ word }: { word: WordEntry }) {
    return (
        <div>
            <h1 className="text-2xl font-bold">{word.word} <span className="text-gray-500">[{word.pronunciation}]</span></h1>
            <dl>
                {word.etymology_prefix && <><dt className="font-bold">語源</dt>
                <dd>{word.etymology_prefix}</dd> </>}
                {word.translation && <><dt className="font-bold">意味</dt>
                <dd>{word.translation.join(", ")}</dd> </>}
                {word.example && <><dt className="font-bold">例文</dt>
                <dd>{word.example.slice(0, 3).map((e) => <p key={e.e}>{e.e} / {e.j}</p>)}</dd> </>}
                {word.phrase && <><dt className="font-bold">フレーズ</dt>
                <dd>{word.phrase.map((p) => <p key={p.w}>{p.w} / {p.x.join(", ")}</p>)}</dd> </>}
            </dl>
        </div>
    );
}