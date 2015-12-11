package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Reducer;

public class RecommendReducerFinish extends Reducer<Text, Text, Text, Text> {

	@Override
	// Outputs the list of vertices and their final ranks, sorted by decreasing
	// rank. See RecommendMapperFinish for explanation of how the values arrive
	// in the order desired.
	public void reduce(Text key, Iterable<Text> values, Context context)
			throws IOException, InterruptedException {
		// Output the friend request score for each pair of vertices.
		for (Text vertex : values) {
			// Output the value.
			context.write(key, vertex);
		}
	}
}