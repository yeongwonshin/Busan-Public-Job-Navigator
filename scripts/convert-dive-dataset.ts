import fs from 'node:fs';
import path from 'node:path';
import { normalizeDatasetFromText } from '../src/services/datasetAdapter';

const [, , inputArg = 'data/sample/jobs.sample.json', outputArg = 'data/generated/jobs.normalized.json'] = process.argv;
const input = path.resolve(process.cwd(), inputArg);
const output = path.resolve(process.cwd(), outputArg);

if (!fs.existsSync(input)) {
  console.error(`입력 파일을 찾을 수 없습니다: ${input}`);
  process.exit(1);
}

const raw = fs.readFileSync(input, 'utf-8');
const jobs = normalizeDatasetFromText(raw, input);
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(jobs, null, 2), 'utf-8');
console.log(`변환 완료: ${jobs.length}개 공고 -> ${output}`);
