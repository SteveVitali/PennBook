package edu.upenn.nets212.pennbook;

import java.io.IOException;

import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Mapper;

public class SocialRankMapperCount extends
		Mapper<LongWritable, Text, Text, Text> {

	@Override
	// Our map method: outputs intermediate key-value pairs of
	// Text-Text objects. It reads each file in our input
	// directory one line at a time. The corresponding reducer is meant to count
	// this mapper's output for bidirectional and unidirectional edges, and then
	// output the fraction of reciprocity as detailed in reciprocity.txt.
	public void map(LongWritable key, Text value, Context context)
			throws IOException, InterruptedException {
		// Split the line into a vertex-vertex set of end points.
		String line = value.toString();
		String[] ends = line.split("\t");

		// Emit the difference all to a single reducer, so that the fraction can
		// be calculated.
		if (ends[0].toString().charAt(0) == 'b') {
			context.write(new Text("foo"), new Text("b"));
		} else {
			context.write(new Text("foo"), new Text("u"));
		}
	}
}