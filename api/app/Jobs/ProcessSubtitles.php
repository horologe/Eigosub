<?php

namespace App\Jobs;

use App\Models\ProcessedSubtitle;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ProcessSubtitles implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $processedSubtitle;
    protected $subtitles;

    /**
     * Create a new job instance.
     */
    public function __construct(ProcessedSubtitle $processedSubtitle, array $subtitles)
    {
        $this->processedSubtitle = $processedSubtitle;
        $this->subtitles = $subtitles;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $this->processedSubtitle->update(['status' => 'processing']);

        try {
            $subtitlesJson = json_encode($this->subtitles);

            $apiKey = env('GEMINI_API_KEY');
            if (!$apiKey) {
                throw new \Exception('GEMINI_API_KEY is not set in .env file.');
            }

            $prompt = <<<EOF
# タスク
あなたは、英語教師である英語の動画を日本人にわかりやすいよう日本語で補足してください。
具体的には、talk intoやget downなどのイディオムやpice of cake、
stright from horse's mouthなどの慣用表現など、日本人中学生が一目見て
わからないであろう内容について、短い簡潔な日本語訳をmeaningに付け加えます。
そうでない部分はmeaningを空文字にします。

# 例1
## 入力:
```json
[
  {
    "text": "This is Kimi K2 and it’s a bit like a \nSwiss army knife the size of a building.  ",
    "start": 0.24,
    "duration": 6.24
  },
  {
    "text": "Huge but somehow still handy and does \nuseful things. Oh yes, give me that.",
    "start": 6.48,
    "duration": 6.4
  },
  {
    "text": "And for me, I feel that it just \ncame out of nowhere. This is the  ",
    "start": 12.88,
    "duration": 4.8
  }
]
```

## 出力:
```json
[
  {
    "text": [
      {
        "content": "This is Kimi K2 and it’s a bit like a \n",
        "meaning": ""
      },
      {
        "content": "Swiss army knife",
        "meaning": "万能ナイフ",
      },
      {
        "content": " the size of a building.  ",
        "meaning": ""
      }
    ],
    "start": 0.24,
    "duration": 6.24
  },
  {
    "text": [
      {
        "content": "Huge but somehow still handy and does \nuseful things. ",
        "meaning": ""
      },
      {
        "content": "Oh yes, give me that.",
        "meaning": "ぜひ欲しい"
      }
    ],
    "start": 6.48,
    "duration": 6.4
  },
  {
    "text": [
      {
        "content": "And for me, I feel that it just \n",
        "meaning": ""
      },
      {
        "content": "came out of nowhere.",
        "meaning": "突然出てきた"
      }
    ],
    "start": 12.88,
    "duration": 4.8
  }
]

# 例2
## 入力:
```json
[
  {
    "text": "It was foolish of you to come here tonight Tom.",
    "start": 4.22,
    "duration": 2.54
  },
  {
    "text": "The Aurors are on their way.",
    "start": 7.26,
    "duration": 2.18
  },
  {
    "text": "By which time I shall be gone,",
    "start": 9.44,
    "duration": 2.02
  },
  {
    "text": "and you",
    "start": 11.82,
    "duration": 0.5
  },
  {
    "text": "shall be dead.",
    "start": 15.08,
    "duration": 0.88
  }
]
```
## 出力:
```json
[
  {
    "text": [
      {
        "content": "It ",
        "meaning": ""
      },
      {
        "content": "was foolish of",
        "meaning": "馬鹿げてたことだ"
      },
      {
        "content": "you to come here tonight Tom.",
        "meaning": ""
      }
    ],
    "start": 4.22,
    "duration": 2.54
  },
  {
    "text": [
      {
        "content": "The Aurors are ",
        "meaning": ""
      },
      {
        "content": "on their way.",
        "meaning": "向かっている"
      }
    ],
    "start": 7.26,
    "duration": 2.18
  },
  {
    "text": [
      {
        "content": "By which time",
        "meaning": "その頃には"
      },
      {
        "content": "I shall be gone,",
        "meaning": ""
      }
    ],
    "start": 9.44,
    "duration": 2.02
  },
  {
    "text": [
      {
        "content": "and you",
        "meaning": ""
      }
    ],
    "start": 11.82,
    "duration": 0.5
  },
  {
    "text": [
      {
        "content": "shall be dead.",
        "meaning": ""
      }
    ],
    "start": 15.08,
    "duration": 0.88
  }
]
```

# 入力
字幕のデータがjsonで添付されます。
textには字幕の内容、startには字幕の開始時間、durationには字幕の長さが入っています。

# 出力
上記の例のように、textには字幕の内容、startには字幕の開始時間、durationには字幕の長さを出力します。
textは配列で、contentには字幕の内容、meaningには日本語訳を出力します。
EOF;

            $response = Http::timeout(600)->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' . $apiKey, [
                'system_instruction' => [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ],
                'contents' => [['parts' => [['text' => $subtitlesJson],]]],
                'generationConfig' => [
                    'responseMimeType' => 'application/json',
                    'responseSchema' => [
                        'type' => 'array',
                        'items' => ['type' => 'object', 'properties' => [
                            'text' => ['type' => 'array', 'items' => ['type' => 'object', 'properties' => [
                                'content' => ['type' => 'string'],
                                'meaning' => ['type' => 'string']
                            ]]],
                            'start' => ['type' => 'number'],
                            'duration' => ['type' => 'number']
                        ]]
                    ]
                ]
            ]);

            if ($response->failed()) {
                throw new \Exception('Gemini API request failed. Status: ' . $response->status() . ' Body: ' . $response->body());
            }

            $result = $response->json();
            $jsonText = $result['candidates'][0]['content']['parts'][0]['text'] ?? '';

            $this->processedSubtitle->update([
                'status' => 'completed',
                'result' => json_decode($jsonText, true),
            ]);

        } catch (\Exception $e) {
            $this->processedSubtitle->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);
        }
    }
}