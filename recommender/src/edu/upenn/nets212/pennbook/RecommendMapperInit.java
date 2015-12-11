package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class RecommendMapperInit extends
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
		// Parse the input line into its two vertices.
		String line = value.toString();
		String[] ends = line.split("\t");

		// Emit every edge in the graph.
		context.write(new Text(ends[0]), new Text(ends[1]));
		
		// Found this edge-case where nodes with no outgoing edges (ex: v4 from
		// write-up) were being emitted, handle that here by potentially
		// redundantly emitting every node with an inbound edge.
		context.write(new Text(ends[1]), new Text("none"));
	}
}