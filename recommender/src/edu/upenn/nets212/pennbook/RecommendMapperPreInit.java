package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class RecommendMapperPreInit extends
		Mapper<LongWritable, Text, Text, Text> {

	@Override
	// Our map method: outputs intermediate key-value pairs of
	// Text-Text objects. It reads each file in our input
	// directory one line at a time. The corresponding reducer is meant to
	// prepare the data for the SocialRank algorithm as implemented by the
	// "iter" command. To do so, the map function prepares each vertex to know
	// what its adjacent vertices (if any) are.
	public void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {
		// Parse the input line into its vertices and sentinel.
		String line = value.toString();
		String[] ends = line.split("\t");

		// Emit every edge in the graph.
		// If it does not represent an interest, mark it as such.
		if (ends[2].equals("0")) {
			context.write(new Text(ends[1]), new Text(ends[0]));
		} else {
			context.write(new Text("*" + ends[0]), new Text(ends[1]));

			// Don't emit nodes with no outbound edges.
			context.write(new Text("*" + ends[1]), new Text("none"));
		}
	}
}