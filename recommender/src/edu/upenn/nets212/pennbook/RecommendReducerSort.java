package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class RecommendReducerSort extends Reducer<Text, Text, Text, Text> {

	@Override
	// Outputs the maximum absolute difference from the differences between each
	// grouping of two ranks in sorted descending order.
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {
		// Finds the maximum.
		Double max = Double.MIN_VALUE;
		for (Text diff : values) {
			Double val = Double.parseDouble(diff.toString());
			if (val > max) {
				max = val;
			}
		}

		// Output the maximum difference.
		context.write(new Text("" + max), new Text(""));
	}
}