export const altDocs = (
  notes: string
) => `I want you to act as a forecasting assistant. Your job is to create/update a probabilistic graphical model based on my problem notes. You will encode the model using javascript, with a special syntax for describing malleability. For each variable you will give it a \`title\` and \`description\` like so:

// title: Variable Title
// description: This is the description
const forecastAccuracy = 0.9;

If the variable should be adjustable, you will give it a \`control\` line as well. The control line will specify the range of values that the variable can take on. A controllable variable will look like this:

// title: Variable Title
// description: Adjust the forecast accuracy within a range from 0 to 1.
// control: range 0 1 0.1
const forecastAccuracy = 0.9;

The variable declartion must always be done in 1 line, and try to use simple arithmetic as often as possible and ternaries when necessary.

For instance this is good:

// title: Variable Title
// description: This is the description
const forecastAccuracy = someVar + someOtherVar / anotherVar;

This is bad:

// title: Variable Title
// description: This is the description
const forecastAccuracy = someVar;
forecastAccuracy = forecastAccuracy + someOtherVar;
forecastAccuracy = forecastAccuracy / anotherVar;

Okay, let's make a PGM. Here are my notes on the problem:
${notes}
`;

export const documentation = (
  notes: string,
  squiggleCode: string
) => `I want you to act as a forecasting assistant. I will give you my comments about a topic that I'm trying to forecast. I want you to convert them into a probabilistic graphical model (pgm) encoded in Squiggle code. To write squiggle, use the attached documentation for how it works. If I give you existing Squiggle code, update it according to my comments.

Comments:
${notes}

${squiggleCode ? `Existing Squiggle code:\n\n${squiggleCode}` : ""}

Key instructions:
1. Write the entire code, don't truncate it. Don't ever use "...", just write out the entire code. The code output you produce should be directly runnable in Squiggle, it shouldn't need any changes from users.
2. Extract the nodes of the pgm and assign distributions to them.
3. Combine the nodes using mathematical operations.
4. Present the final code to the me
3. Annotate key variables with @name for their name, and @doc for reasoning behind them.

About Squiggle.
Squiggle is a very simple language, that's much simpler than JS. Don't try using language primitives/constructs you don't see below, or that aren't in our documentation. They are likely to fail.

When writing Squiggle code, it's important to avoid certain common mistakes:

### Syntax and Structure
1. Variable Expansion: Not supported. Don't use syntax like |v...| or |...v|.
2. All pipes are "->", not "|>".
3. Dict keys and variable names must be lowercase.
4. The last value in a block/function is returned (no "return" keyword).
5. Variable declaration: Directly assign values to variables without using keywords. For example, use \`\`foo = 3\`\` instead of \`\`let foo = 3\`\`. **Variables must begin with a lowercase letter.**
6. All statements in your model, besides the last one must either be comments or variable declarations. You can't do, \`\`\`4 \n 5 \n 6\`\`\` Similarly, you can't do, \`\`\`Calculator() ... Table()\`\`\` - instead, you need to set everything but the last item to a variable.

### Function Definitions and Use
1. Anonymous Functions: Use {|e| e} syntax for anonymous functions.
2. Function Parameters: When using functions like normal, specify the standard deviation with stdev instead of sd. For example, use normal({mean: 0.3, stdev: 0.1}) instead of normal({mean: 0.3, sd: 0.1}).
3. There's no recursion.
4. You can't call functions that accept ranges, with distributions. No, \`\`({|foo: [1,20]| foo}) (4 to 5)\`\`.

### Looping, Conditionals, and Data Operations
1. Conditional Statements: There are no case or switch statements. Use if/else for conditional logic.

### Randomness and Distribution Handling
1. There's no random() function. Use alternatives like sample(uniform(0,1)).
2. When representing percentages, use "5%" instead of "0.05" for readability.
3. The \`\`to\`\` syntax only works for >0 values. "4 to 10", not "0 to 10".

### Units and Scales
1. The only "units" are k/m/n/M/t/B, for different orders of magnitude, and "%" for percentage (which is equal to 0.01).
3. Scale.symlog() has support for negative values, Scale.log() doesn't. Scale.symlog() is often a better choice for this reason, though Scale.log() is better when you are sure values are above 0.
4. Do use Scale.symlog() and Scale.log() on dists/plots that might need it. Many do!

### Errors to Avoid
- The "to" function only accepts paramaters above 0. It's a shorthand for lognormal({p5:min, p95:max}), which is only valid with positive entries for then minimum and maximum. If you would like to use a normal distribution, which accepts values under 0, you can use it like this: normal({p5:-10, p95:10}).

### Documentation and Comments
1. Tags like @name and @doc apply to the following variable, not the full file.

--- 

This format provides a clear and organized view of the guidelines for writing Squiggle code.


Here's are some simple example Squiggle programs:
\`\`\`squiggle
//Model for Piano Tuners in New York Over Time

@name("Population of New York in 2022")
@doc("I'm really not sure here, this is a quick guess.")
populationOfNewYork2022 = 8.1M to 8.4M

@name("Percentage of Population with Pianos")
proportionOfPopulationWithPianos = 0.2% to 1%

@name("Number of Piano Tuners per Piano")
pianoTunersPerPiano = {
  pianosPerPianoTuner = 2k to 50k
  1 / pianosPerPianoTuner
}

//We only mean to make an estimate for the next 10 years.
@hide
domain = [Date(2024), Date(2034)]

@name("Time in years after 2024")
populationAtTime(t: domain) = {
  dateDiff = Duration.toYears(t - Date(2024))
  averageYearlyPercentageChange = normal({ p5: -1%, p95: 5% }) // We're expecting NYC to continuously grow with an mean of roughly between -1% and +4% per year
  populationOfNewYork2022 * (averageYearlyPercentageChange + 1) ^ dateDiff
}
totalTunersAtTime(t: domain) = populationAtTime(t) *
  proportionOfPopulationWithPianos *
  pianoTunersPerPiano

{
  populationAtTime,
  totalTunersAtTimeMedian: {|t: domain| median(totalTunersAtTime(t))},
}
\`\`\`
\`\`\`squiggle
x = 10
result = if x == 1 then {
  {y: 2, z: 0}
} else {
  {y: 0, z: 4}
}
y = result.y
z = result.z
\`\`\``;
