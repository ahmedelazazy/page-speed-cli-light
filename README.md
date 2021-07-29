### Usage

- Update `.env`
- `npm run start`
- The results will show in console
- The results will be saved in `output.txt`

### Sample Command

```
ROUNDS=20 EXP="Experiment 1" npm run start
```

### Environment Variables

| Variable          | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| PAGESPEED_API_KEY | Google Page Speed Insights API Key                         |
| URL               | The page URL to measure its performance                    |
| DEVICE            | Run the performance test on mobile or desktop              |
| ROUNDS            | Number of rounds to run the test                           |
| EXP               | The name of the experiment to be saved in the `output.txt` |
